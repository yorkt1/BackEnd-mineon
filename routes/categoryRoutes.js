import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

const router = Router();

// Rotas públicas
router.get('/', getCategories);
router.get('/', getCategories);
// Rotas de administração (requerem autenticação e privilégios de admin)
router.post('/', authenticateToken, authorizeAdmin, createCategory);
router.put('/:id', authenticateToken, authorizeAdmin, updateCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteCategory);

export default router;