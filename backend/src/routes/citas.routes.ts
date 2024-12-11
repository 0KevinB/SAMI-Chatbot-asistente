// routes/citas.routes.ts
import { Router } from "express";
import { CitasController } from "../controllers/citas.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", CitasController.crearCita);
router.get("/medico/:medicoCedula", CitasController.obtenerCitasMedico);
router.put("/:id", CitasController.actualizarEstadoCita);

export default router;
