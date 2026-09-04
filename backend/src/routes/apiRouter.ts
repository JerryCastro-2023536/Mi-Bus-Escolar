import { verificarAutenticacion } from './../utils/middleware/auth.middleware';
import { Router } from "express";
import usuarioRoutes from './usuario.route';
import viajesRoutes from './viaje.route'
import  ubicacionesRoutes  from "./ubicacionesBus.route";
import rutasParadasRoutes from "./rutaParada.route"
import anonymRoutes from "./anonym.route"

const apiRouter = Router();

apiRouter.use(anonymRoutes)
apiRouter.use(verificarAutenticacion)

apiRouter.use(usuarioRoutes);
apiRouter.use(viajesRoutes);
apiRouter.use(ubicacionesRoutes);
apiRouter.use(rutasParadasRoutes);

export default apiRouter;