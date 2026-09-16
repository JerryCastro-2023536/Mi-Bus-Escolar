import { Router } from "express";
import {
    getKpisUsuarios,
    getKpisAsignacionesRuta,
    getKpisAsistencias,
    getKpisChoferes,
    getKpisColegios,
    getKpisEstudiantes,
    getKpisIncidencias,
    getKpisNotificaciones,
    getKpisPagos,
    getKpisParadas,
    getKpisProveedores,
    getKpisRutaParada,
    getKpisRutas,
    getKpisServicios,
    getKpisUbicacionesBus,
    getKpisValoraciones,
    getKpisVehiculos,
    getKpisViajes
} from "../controllers/kpis.controller";

const router = Router();

router.get("/kpis/usuarios", getKpisUsuarios);
router.get("/kpis/asignaciones-ruta", getKpisAsignacionesRuta);
router.get("/kpis/asistencias", getKpisAsistencias);
router.get("/kpis/choferes", getKpisChoferes);
router.get("/kpis/colegios", getKpisColegios);
router.get("/kpis/estudiantes", getKpisEstudiantes);
router.get("/kpis/incidencias", getKpisIncidencias);
router.get("/kpis/notificaciones", getKpisNotificaciones);
router.get("/kpis/pagos", getKpisPagos);
router.get("/kpis/paradas", getKpisParadas);
router.get("/kpis/proveedores", getKpisProveedores);
router.get("/kpis/ruta-parada", getKpisRutaParada);
router.get("/kpis/rutas", getKpisRutas);
router.get("/kpis/servicios", getKpisServicios);
router.get("/kpis/ubicaciones-bus", getKpisUbicacionesBus);
router.get("/kpis/valoraciones", getKpisValoraciones);
router.get("/kpis/vehiculos", getKpisVehiculos);
router.get("/kpis/viajes", getKpisViajes);

export default router;