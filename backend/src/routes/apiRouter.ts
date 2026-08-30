import { Router } from "express";
import usuarioRoutes from './usuario.route';
import viajesRoutes from './viaje.route'

const apiRouter = Router();
apiRouter.use(usuarioRoutes);
apiRouter.use(viajesRoutes);

export default apiRouter;