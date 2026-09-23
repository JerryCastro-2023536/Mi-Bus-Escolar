import { Router } from 'express';

import {
  getViajeHoy,
  getTrazado,
  getTrazadoAsistencia,
  patchIniciarRuta,
  patchFinalizarRuta,
  postUbicacionGPS,
  getUltimaUbicacionViaje,
  getChoferPorUsuario,
  getEstudiantesConAsistencia,
  patchAbordajeEstudiante,
  patchDescensoEstudiante,
  patchAusenteEstudiante,
  postTrazadoActivo,
  getTrazadoActivo
} from '../controllers/trazadoruta.controller';

const router = Router();


router.get(
  '/viajes/hoy/:idChofer',
  getViajeHoy
);

router.get(
  '/viajes/:idViaje/ubicacion-actual',
  getUltimaUbicacionViaje
);

router.post(
  '/viajes/:idViaje/trazado-activo',
  postTrazadoActivo
);

router.get(
  '/viajes/:idViaje/trazado-activo',
  getTrazadoActivo
);


router.get(
  '/rutas/:idRuta/paradas',
  getTrazado
);

router.get(
  '/rutas/:idRuta/paradas-asistencia/:idViaje',
  getTrazadoAsistencia
);


/*
 * iniciarViaje() recibe idChofer.
 * Se elimina /viajes/:idViaje/iniciar porque enviaba
 * accidentalmente el idViaje como si fuera idChofer.
 */
router.post(
  '/viajes/iniciar/:idChofer',
  patchIniciarRuta
);

router.post(
  '/viajes/iniciar',
  patchIniciarRuta
);


router.patch(
  '/viajes/:idViaje/finalizar',
  patchFinalizarRuta
);

router.post(
  '/viajes/:idViaje/finalizar',
  patchFinalizarRuta
);


router.post(
  '/ubicaciones',
  postUbicacionGPS
);

router.post(
  '/ubicaciones-bus',
  postUbicacionGPS
);


router.get(
  '/chofer/usuario/:idUsuario',
  getChoferPorUsuario
);

router.get(
  '/viajes/chofer/:idChofer/estudiantes',
  getEstudiantesConAsistencia
);


router.patch(
  '/viajes/:idViaje/abordaje/:idEstudiante',
  patchAbordajeEstudiante
);

router.patch(
  '/viajes/:idViaje/descenso/:idEstudiante',
  patchDescensoEstudiante
);

router.patch(
  '/viajes/:idViaje/ausente/:idEstudiante',
  patchAusenteEstudiante
);


export default router;
