adminMiddleware.jsa// Este middleware já está incluído em authMiddleware.js.
// Mantenha-o para clareza ou remova este arquivo e importe diretamente de authMiddleware.

import { authorizeAdmin } from './authMiddlewares.js';

export { authorizeAdmin };