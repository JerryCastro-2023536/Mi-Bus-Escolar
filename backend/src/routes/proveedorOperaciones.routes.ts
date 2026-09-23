import { Router } from "express";
import {
    getServicios,
    getVehiculos,
    getChoferes,
    getUsuariosChofer,
    postChofer,
    putChofer,
    deleteChofer,
    deleteRutasChofer,
    getRutas,
    postRuta,
    putRuta,
    putRutaChofer,
    putRutaVehiculo,
    deleteRuta,
    getAsignaciones,
    getEstudiantesBuscar,
    postEstudiante,
    deleteEstudiante,
    getIncidencias,
    getViajes,
    getValoraciones,
} from "../controllers/proveedorOperaciones.controller";

const router = Router();
const p = "/proveedor-operaciones/:idUsuario";

router.get(`${p}/servicios`, getServicios);
router.get(`${p}/vehiculos`, getVehiculos);
router.get(`${p}/choferes`, getChoferes);
router.get(`${p}/usuarios-chofer`, getUsuariosChofer);
router.post(`${p}/choferes`, postChofer);
router.put(`${p}/choferes/:idChofer`, putChofer);
router.delete(`${p}/choferes/:idChofer/rutas`, deleteRutasChofer);
router.delete(`${p}/choferes/:idChofer`, deleteChofer);
router.get(`${p}/rutas`, getRutas);
router.post(`${p}/rutas`, postRuta);
router.put(`${p}/rutas/:idRuta`, putRuta);
router.put(`${p}/rutas/:idRuta/chofer`, putRutaChofer);
router.put(`${p}/rutas/:idRuta/vehiculo`, putRutaVehiculo);
router.delete(`${p}/rutas/:idRuta`, deleteRuta);
router.get(`${p}/rutas/:idRuta/estudiantes`, getAsignaciones);
router.get(`${p}/rutas/:idRuta/estudiantes/buscar`, getEstudiantesBuscar);
router.post(`${p}/rutas/:idRuta/estudiantes`, postEstudiante);
router.delete(`${p}/rutas/:idRuta/estudiantes/:idAsignacion`,deleteEstudiante,);
router.get(`${p}/incidencias`, getIncidencias);
router.get(`${p}/viajes`, getViajes);
router.get(`${p}/servicios/:idServicio/valoraciones`, getValoraciones);

export default router;
