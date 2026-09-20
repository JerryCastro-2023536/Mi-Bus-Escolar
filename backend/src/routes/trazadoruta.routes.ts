import { Router } from 'express';
import {
  getViajeHoy,
  getTrazado,
  getTrazadoAsistencia,
  patchIniciarRuta,
  patchFinalizarRuta,
  postUbicacionGPS,
  getChoferPorUsuario,
  getEstudiantesConAsistencia,
  patchAbordajeEstudiante,
  patchDescensoEstudiante,
  patchAusenteEstudiante
} from '../controllers/trazadoruta.controller';

const router = Router();


router.get('/viajes/hoy/:idChofer', getViajeHoy);


router.get('/rutas/:idRuta/paradas', getTrazado);
router.get('/rutas/:idRuta/paradas-asistencia/:idViaje', getTrazadoAsistencia);

router.patch('/viajes/:idViaje/iniciar', patchIniciarRuta);
router.post('/viajes/iniciar/:idChofer', patchIniciarRuta);
router.post('/viajes/iniciar', patchIniciarRuta);

router.patch('/viajes/:idViaje/finalizar', patchFinalizarRuta);
router.post('/viajes/:idViaje/finalizar', patchFinalizarRuta);

router.post('/ubicaciones', postUbicacionGPS);
router.post('/ubicaciones-bus', postUbicacionGPS);

router.get('/chofer/usuario/:idUsuario', getChoferPorUsuario);

router.get('/viajes/chofer/:idChofer/estudiantes', getEstudiantesConAsistencia);

router.patch('/viajes/:idViaje/abordaje/:idEstudiante', patchAbordajeEstudiante);

router.patch('/viajes/:idViaje/descenso/:idEstudiante', patchDescensoEstudiante);

router.patch('/viajes/:idViaje/ausente/:idEstudiante', patchAusenteEstudiante);

export default router;

