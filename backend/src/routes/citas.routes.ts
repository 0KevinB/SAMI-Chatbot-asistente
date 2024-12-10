import { Router } from "express";
import { CitasController } from "@/controllers/citas.controller";
import { body, param } from "express-validator";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

// Middleware de autenticación para todas las rutas de citas
router.use(authMiddleware);

router.post(
  "/",
  [
    body("medicoId")
      .notEmpty()
      .withMessage("El ID del médico es obligatorio")
      .isString()
      .withMessage("El ID del médico debe ser una cadena de texto"),
    body("pacienteId")
      .notEmpty()
      .withMessage("El ID del paciente es obligatorio")
      .isString()
      .withMessage("El ID del paciente debe ser una cadena de texto"),
    body("fecha")
      .notEmpty()
      .withMessage("La fecha de la cita es obligatoria")
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
    body("hora")
      .notEmpty()
      .withMessage("La hora de la cita es obligatoria")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido (HH:MM)"),
  ],
  CitasController.crearCita
);

router.get("/", CitasController.obtenerCitas);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("El ID de la cita es obligatorio")],
  CitasController.obtenerCitaPorId
);

router.get(
  "/medico/:medicoId",
  [param("medicoId").notEmpty().withMessage("El ID del médico es obligatorio")],
  CitasController.obtenerCitasPorMedico
);

router.get(
  "/paciente/:pacienteId",
  [
    param("pacienteId")
      .notEmpty()
      .withMessage("El ID del paciente es obligatorio"),
  ],
  CitasController.obtenerCitasPorPaciente
);

router.put(
  "/:id",
  [
    param("id").notEmpty().withMessage("El ID de la cita es obligatorio"),
    body("fecha")
      .optional()
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
    body("hora")
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido (HH:MM)"),
    body("estado")
      .optional()
      .isIn(["programada", "confirmada", "cancelada", "completada"])
      .withMessage("Estado de cita inválido"),
  ],
  CitasController.actualizarCita
);

router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("El ID de la cita es obligatorio")],
  CitasController.eliminarCita
);

export default router;
