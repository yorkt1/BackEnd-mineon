import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nome: name,           // Campo correto do banco
        email,
        senhaHash: hashedPassword,
        isAdmin: false,       // Usuário padrão não é admin
      },
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: user.id });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentativa login:', email, password);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Usuário achado:', user);
    if (!user || !(await bcrypt.compare(password, user.senhaHash))) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
    const token = generateToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

export { registerUser, loginUser };
