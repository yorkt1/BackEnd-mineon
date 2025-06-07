import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  const { query, categoria } = req.query;

  console.log('Recebido query:', query);
  console.log('Recebido categoria:', categoria);

  try {
    const products = await prisma.Produto.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { nome: { contains: query, mode: 'insensitive' } },
                  { descricao: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
          categoria
            ? {
                categoria: {
                  slug: categoria,
                },
              }
            : {},
        ],
      },
      include: {
        categoria: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.Produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
      },
    });
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produto.' });
  }
};

const createProduct = async (req, res) => {
  const { nome, descricao, preco, imagemUrl, estoque, categoriaId } = req.body;
  try {
    const product = await prisma.Produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagemUrl,
        estoque: parseInt(estoque),
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar produto.' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagemUrl, estoque, categoriaId } = req.body;
  try {
    const product = await prisma.Produto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagemUrl,
        estoque: parseInt(estoque),
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar produto.' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.Produto.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar produto.' });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
