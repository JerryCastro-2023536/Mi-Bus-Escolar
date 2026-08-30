import { Router } from "express";
import usuarioRoutes from './usuario.route';

const apiRouter = Router();
apiRouter.use(usuarioRoutes);

export default apiRouter;