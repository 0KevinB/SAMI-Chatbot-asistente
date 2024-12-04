import express from "express";
import multer from "multer";
import { HistoriaClinicaController } from "../controllers/historia_clinica.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/crear", upload.single("pdf"), HistoriaClinicaController.crear);
router.get("/:id", HistoriaClinicaController.obtenerPorId);

// Puedes agregar más rutas según sea necesario

export default router;
