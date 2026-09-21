import { Router } from 'express';
import { loginUsuario, registerUsuario } from '../controllers/usuario.controller';
import { validateSchema } from '../utils/middleware/schemaValidator';
import { loginUserSchema, registerUserSchema } from '../validators/user.validator';
import { getValoraciones1, obtenerProveedores1, obtenerRutas1, obtenerServicios1 } from '../controllers/valoraciones-landing.controller';

const router = Router();

router.post('/login', validateSchema(loginUserSchema),loginUsuario);
router.post('/register', validateSchema(registerUserSchema),registerUsuario);
router.get('/landing/proveedores', obtenerProveedores1);
router.get('/landing/rutas', obtenerRutas1);
router.get('/landing/servicios', obtenerServicios1);
router.get('/landing/valoraciones', getValoraciones1);

export default router;