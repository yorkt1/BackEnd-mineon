import { verifyToken } from '../utils/jwt.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }

  req.user = user; // Anexa o usuário autenticado ao objeto de requisição
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado: Requer privilégios de administrador' });
  }
  next();
};

export { authenticateToken, authorizeAdmin };