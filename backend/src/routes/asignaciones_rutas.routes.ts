import { Router } from "express";
import { deleteAsignacionRuta, getAsignacionesRutas, getAsignacionRutaById, postAsignacionesRutas, putAsignacionRuta } from "../controllers/asignacionesRutas.controller";

const router = Router();

router.get("/asignaciones", getAsignacionesRutas);
router.get("/asignaciones/:id", getAsignacionRutaById);
router.post("/asignaciones", postAsignacionesRutas);
router.put("/asignaciones/:id", putAsignacionRuta);
router.delete("/asignaciones/:id", deleteAsignacionRuta);