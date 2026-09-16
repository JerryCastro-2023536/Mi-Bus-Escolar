import { Router } from 'express';
import { getViajeHoy, getTrazado, patchIniciarRuta, patchFinalizarRuta, postUbicacionGPS } from '../controllers/trazadoruta.controller';

const router = Router();

// GET /api/viajes/hoy/1
router.get('/viajes/hoy/:idChofer', getViajeHoy);

// GET /api/rutas/5/paradas
router.get('/rutas/:idRuta/paradas', getTrazado);

// POST o PATCH para iniciar el viaje (soporta idChofer o idViaje)
router.patch('/viajes/:idViaje/iniciar', patchIniciarRuta);
router.post('/viajes/iniciar/:idChofer', patchIniciarRuta);
router.post('/viajes/iniciar', patchIniciarRuta);

// PATCH /api/viajes/:idViaje/finalizar
router.patch('/viajes/:idViaje/finalizar', patchFinalizarRuta);
router.post('/viajes/:idViaje/finalizar', patchFinalizarRuta);

// POST /api/ubicaciones y POST /api/ubicaciones-bus para telemetría GPS
router.post('/ubicaciones', postUbicacionGPS);
router.post('/ubicaciones-bus', postUbicacionGPS);

export default router;
