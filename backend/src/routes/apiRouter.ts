import { Router } from "express";
import usuarioRoutes from './usuario.route';
import viajesRoutes from './viaje.route'
import  ubicacionesRoutes  from "./ubicacionesBus.route";

const apiRouter = Router();
apiRouter.use(usuarioRoutes);
apiRouter.use(viajesRoutes);
apiRouter.use(ubicacionesRoutes);

export default apiRouter;