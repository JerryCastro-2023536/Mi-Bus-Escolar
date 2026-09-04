import { Router } from 'express';
import asistenciasRoutes from './asistencias.routes';
import choferesRoutes from './choferes.routes';
import colegiosRoutes from './colegios.routes';
import estudiantesRoutes from './estudiantes.routes';
import valoracionesRoutes from './valoraciones.routes';

const apiRouter = Router();

apiRouter.use(asistenciasRoutes);
apiRouter.use(choferesRoutes);
apiRouter.use(colegiosRoutes);
apiRouter.use(estudiantesRoutes);
apiRouter.use(valoracionesRoutes);

export default apiRouter;
