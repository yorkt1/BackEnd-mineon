import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getAllUsers
} from '../controllers/userController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

const router = Router();

// Rotas de perfil do usuário (requer autenticação)
router.get('/', authenticateToken, getUserProfile);
router.put('/', authenticateToken, updateProfile);

// Rotas de endereço do usuário (requer autenticação)
router.post('/perfil/enderecos', authenticateToken, addUserAddress);
router.put('/perfil/enderecos/:addressId', authenticateToken, updateUserAddress);
router.delete('/perfil/enderecos/:addressId', authenticateToken, deleteUserAddress);

// Rota para listar todos os usuários (apenas admin)
router.get('/admin/usuarios', authenticateToken, authorizeAdmin, getAllUsers);

export default router;