import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/cadastro', registerUser);
router.post('/login', loginUser);

export default router;