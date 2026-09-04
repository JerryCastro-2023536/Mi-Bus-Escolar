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
import asistenciasRoutes from './asistencias.routes';
import choferesRoutes from './choferes.routes';
import colegiosRoutes from './colegios.routes';
import estudiantesRoutes from './estudiantes.routes';
import valoracionesRoutes from './valoraciones.routes';
import asignacionesRoutes from './asignaciones_rutas.routes';
import notificacionesRoutes from './notificaciones.routes';
import pagosRoutes from './pagos.routes';
import rutasParadasRoutes from './paradas.routes';

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

apiRouter.use(asistenciasRoutes);
apiRouter.use(choferesRoutes);
apiRouter.use(colegiosRoutes);
apiRouter.use(estudiantesRoutes);
apiRouter.use(valoracionesRoutes);

apiRouter.use(asignacionesRoutes);
apiRouter.use(notificacionesRoutes);
apiRouter.use(pagosRoutes);
apiRouter.use(rutasParadasRoutes);

export default apiRouter;
