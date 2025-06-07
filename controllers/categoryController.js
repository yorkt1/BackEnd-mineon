import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.Categoria.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categorias.' });
  }
};

const createCategory = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const category = await prisma.Categoria.create({
      data: { name, slug },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Slug de categoria já existe.' });
    }
    res.status(500).json({ message: 'Erro ao criar categoria.' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const category = await prisma.Categoria.update({
      where: { id: parseInt(id) },
      data: { name, slug },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Slug de categoria já existe.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.Categoria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar categoria.' });
  }
};

export { getCategories, createCategory, updateCategory, deleteCategory };