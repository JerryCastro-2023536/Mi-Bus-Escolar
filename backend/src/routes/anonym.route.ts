import { Router } from 'express';
import { loginUsuario } from '../controllers/usuario.controller';

const router = Router();

router.post('/login', loginUsuario);

export default router;