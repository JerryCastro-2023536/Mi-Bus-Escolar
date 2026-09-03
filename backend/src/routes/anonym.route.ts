import { Router } from 'express';
import { loginUsuario, registerUsuario } from '../controllers/usuario.controller';
import { validateSchema } from '../utils/middleware/schemaValidator';
import { loginUserSchema, registerUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/login', validateSchema(loginUserSchema),loginUsuario);
router.post('/register', validateSchema(registerUserSchema),registerUsuario);

export default router;