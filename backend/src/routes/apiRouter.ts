import {Router} from "express"
import incidenciasRoutes from "./incidencias.routes"
import rutasRoutes from "./rutas.routes"
import serviciosRoutes from "./servicios.routes"
import vehiculosRoutes from "./vehiculos.routes"
import proveedoresRoutes from "./proveedores.routes"

const apiRouter = Router();

apiRouter.use(incidenciasRoutes);
apiRouter.use(rutasRoutes);
apiRouter.use(serviciosRoutes);
apiRouter.use(vehiculosRoutes);
apiRouter.use(proveedoresRoutes);

export default apiRouter;