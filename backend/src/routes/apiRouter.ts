import { Router } from "express";
import asignacionesRoutes from './asignaciones_rutas.routes';
import notificacionesRoutes from './notificaciones.routes';
import pagosRoutes from './pagos.routes';
import rutasParadasRoutes from './paradas.routes';

const apiRouter = Router();

apiRouter.use(asignacionesRoutes);
apiRouter.use(notificacionesRoutes);
apiRouter.use(pagosRoutes);
apiRouter.use(rutasParadasRoutes);

export default apiRouter;
