import { verificarAutenticacion } from './../utils/middleware/auth.middleware';
import { Router } from "express";
import usuarioRoutes from './usuario.route';
import viajesRoutes from './viaje.route'
import  ubicacionesRoutes  from "./ubicacionesBus.route";
import rutasParadasRoutes from "./rutaParada.route"
import anonymRoutes from "./anonym.route"
import incidenciasRoutes from "./incidencias.routes"
import rutasRoutes from "./rutas.routes"
import serviciosRoutes from "./servicios.routes"
import vehiculosRoutes from "./vehiculos.routes"
import proveedoresRoutes from "./proveedores.routes"

const apiRouter = Router();

apiRouter.use(anonymRoutes)
apiRouter.use(verificarAutenticacion)

apiRouter.use(usuarioRoutes);
apiRouter.use(viajesRoutes);
apiRouter.use(ubicacionesRoutes);
apiRouter.use(rutasParadasRoutes);

apiRouter.use(incidenciasRoutes);
apiRouter.use(rutasRoutes);
apiRouter.use(serviciosRoutes);
apiRouter.use(vehiculosRoutes);
apiRouter.use(proveedoresRoutes);

export default apiRouter;