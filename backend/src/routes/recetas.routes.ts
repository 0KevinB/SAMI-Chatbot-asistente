import express from "express";
import multer from "multer";
import { RecetaController } from "@/controllers/recetas.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Crear nueva receta
router.post("/crear", upload.single("pdf"), RecetaController.crear);

// Obtener receta por ID
router.get("/:id", RecetaController.obtenerPorId);

// Listar recetas de un paciente
router.get("/paciente/:pacienteCedula", RecetaController.listarPorPaciente);

export default router;
