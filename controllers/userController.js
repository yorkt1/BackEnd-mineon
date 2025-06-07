import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const getUserProfile = async (req, res) => {
  // req.user vem do middleware de autenticação
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        addresses: true, // Inclui endereços
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário.' });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;
  try {
    let updateData = { name, email };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
};

const addUserAddress = async (req, res) => {
  const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
  const userId = req.user.id;
  try {
    const address = await prisma.address.create({
      data: {
        userId: parseInt(userId),
        cep,
        street: rua,
        number: numero,
        complement,
        neighborhood: bairro,
        city: cidade,
        state,
      },
    });
    res.status(201).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar endereço.' });
  }
};

const updateUserAddress = async (req, res) => {
  const { addressId } = req.params;
  const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
  const userId = req.user.id;
  try {
    const address = await prisma.address.updateMany({ // updateMany para verificar o userId
      where: {
        id: parseInt(addressId),
        userId: parseInt(userId),
      },
      data: {
        cep,
        street: rua,
        number: numero,
        complement,
        neighborhood: bairro,
        city: cidade,
        state,
      },
    });
    if (address.count === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado ou você não tem permissão.' });
    }
    res.status(200).json({ message: 'Endereço atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar endereço.' });
  }
};

const deleteUserAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;
  try {
    const result = await prisma.address.deleteMany({
      where: {
        id: parseInt(addressId),
        userId: parseInt(userId),
      },
    });
    if (result.count === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado ou você não tem permissão.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar endereço.' });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
};


export {
  getUserProfile,
  updateProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getAllUsers
};