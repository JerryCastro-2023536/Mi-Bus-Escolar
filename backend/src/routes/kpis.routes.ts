import { getUsuariosKpis } from "../controllers/kpis.controller";
import router from "./usuario.route";

router.get("/kpis/usuarios", getUsuariosKpis);

export default router