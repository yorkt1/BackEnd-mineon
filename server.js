import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/AuthRouters.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173',], // endereço do seu front
  credentials: true
}));
app.use(express.json());

app.use('/produto', productRoutes);
app.use('/categoria', categoryRoutes);
app.use('/usuario', userRoutes);
app.use('/pedido', orderRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API do E-commerce funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});