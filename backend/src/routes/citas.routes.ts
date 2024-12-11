import { CitaController } from "@/controllers/citas.controller";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();

// Crear cita
router.post(
  "/crear",
  [
    body("usuarioCedula")
      .notEmpty()
      .withMessage("La cédula del usuario es obligatoria"),
    body("medicoCedula")
      .notEmpty()
      .withMessage("La cédula del médico es obligatoria"),
    body("estado")
      .isIn(["pendiente", "aceptada", "rechazada"])
      .withMessage("Estado inválido"),
  ],
  CitaController.crearCita
);

// Aceptar cita
router.put(
  "/aceptar/:id",
  [
    param("id").notEmpty().withMessage("El ID de la cita es obligatorio"),
    body("fecha").notEmpty().withMessage("La fecha es obligatoria"),
    body("horaInicio")
      .notEmpty()
      .withMessage("La hora de inicio es obligatoria"),
    body("horaFin").notEmpty().withMessage("La hora de fin es obligatoria"),
  ],
  CitaController.aceptarCita
);

// Rechazar cita
router.put(
  "/rechazar/:id",
  [param("id").notEmpty().withMessage("El ID de la cita es obligatorio")],
  CitaController.rechazarCita
);

export default router;
