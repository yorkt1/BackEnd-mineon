import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

const router = Router();

// Rota para criar um novo pedido (requer autenticação do usuário)
router.post('/pedidos', authenticateToken, createOrder);

// Rota para listar pedidos (usuário vê os seus, admin vê todos)
router.get('/pedidos', authenticateToken, getOrders);

// Rota para ver detalhes de um pedido específico (usuário vê o seu, admin vê qualquer um)
router.get('/pedidos/:id', authenticateToken, getOrderById);

// Rota para atualizar o status de um pedido (apenas admin)
router.put('/admin/pedidos/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus);

export default router;