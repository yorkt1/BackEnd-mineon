import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const senhaHash = await bcrypt.hash(password, 10);

  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      console.log('Admin já existe.');
      return;
    }

    const admin = await prisma.user.create({
      data: {
        nome: name,
        email,
        senhaHash,
        isAdmin: true,
      },
    });
    console.log('Usuário admin criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
