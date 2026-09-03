import { Router } from 'express';
import { loginUsuario } from '../controllers/usuario.controller';
import { validateSchema } from '../utils/middleware/schemaValidator';
import { loginUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/login', validateSchema(loginUserSchema),loginUsuario);

export default router;