import { Router } from "express";
import { validateSchema } from "../utils/middleware/schemaValidator";
import {
    createValoracionSchema,
    updateValoracionSchema,
    valorarServicioSchema,
} from "../validators/valoraciones.validator";
import {
    deleteValoracion,
    getValoracionById,
    getValoraciones,
    getValoracionesDetalle,
    postValoraciones,
    postValoracionServicio,
    putValoracion,
} from "../controllers/valoraciones.controller";
import { permitirRoles } from "../utils/middleware/roleAuth.middleware";
import { userRol } from "../enums/userRol";

const router = Router();

router.get("/valoraciones", getValoraciones);
router.get("/valoraciones/detalle", getValoracionesDetalle);
router.get("/valoraciones/:id", getValoracionById);
router.post("/valoraciones", validateSchema(createValoracionSchema), postValoraciones);
router.put("/valoraciones/:id", validateSchema(updateValoracionSchema), putValoracion);
router.delete("/valoraciones/:id", deleteValoracion);

// Reseña desde la landing. El usuario se obtiene del JWT y no del body.
router.post(
    "/valoraciones/servicio/:idServicio",
    permitirRoles(userRol.USUARIO),
    validateSchema(valorarServicioSchema),
    postValoracionServicio,
);

export default router;
