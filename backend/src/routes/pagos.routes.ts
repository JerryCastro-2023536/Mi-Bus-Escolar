import { Router } from "express";
import { deletePago, getPagoById, getPagos, postPagos, putPago } from "../controllers/pagos.controller";
import zod from "zod"


const router = Router();

router.get("/pagos", getPagos);
router.get("/pagos/:id", getPagoById);
router.post("/pagos", postPagos);
router.put("/pagos/:id", putPago);
router.delete("/pagos/:id", deletePago);

export default router;
