import { Router } from "express";
import { deletePago, getPagoById, getPagos, postPagos, putPago } from "../controllers/pagos.controller";
import { validateSchema } from "../utils/middleware/schemaValidator";
import { createPagoSchema, updatePagoSchema } from "../validators/pagos.validator";


const router = Router();

router.get("/pagos", getPagos);
router.get("/pagos/:id", getPagoById);
router.post("/pagos", validateSchema(createPagoSchema), postPagos);
router.put("/pagos/:id", validateSchema(updatePagoSchema), putPago);
router.delete("/pagos/:id", deletePago);

export default router;
