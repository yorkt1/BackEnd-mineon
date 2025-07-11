import Produto from '../models/produto.js';

const getProducts = async (req, res) => {
  const { query, categoria } = req.query;

  try {
    const filtros = {};

    if (query) {
      filtros.$or = [
        { nome: { $regex: query, $options: 'i' } },
        { descricao: { $regex: query, $options: 'i' } },
      ];
    }

    if (categoria) {
      filtros.categoria = categoria;
    }

    const produtos = await Produto.find(filtros).populate('categoria');
    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findById(id).populate('categoria');
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado.' });
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produto.' });
  }
};

const createProduct = async (req, res) => {
  const { nome, descricao, preco, imagemUrl, estoque, categoria } = req.body;
  try {
    const novoProduto = new Produto({
      nome,
      descricao,
      preco,
      imagemUrl,
      estoque,
      categoria,
    });
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar produto.' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  try {
    const produto = await Produto.findByIdAndUpdate(id, dados, { new: true });
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar produto.' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Produto.findByIdAndDelete(id);
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
