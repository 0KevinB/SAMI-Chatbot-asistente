import { Router } from "express";
import { body, param, query } from "express-validator";
import { CitaController } from "@/controllers/citas.controller";

const router = Router();

// Crear cita
router.post(
  "/crear",
  [
    body("pacienteCedula")
      .notEmpty()
      .withMessage("La cédula del paciente es obligatoria"),
    body("medicoCedula")
      .notEmpty()
      .withMessage("La cédula del médico es obligatoria"),
    body("fecha")
      .notEmpty()
      .withMessage("La fecha es obligatoria")
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
    body("horaInicio")
      .notEmpty()
      .withMessage("La hora de inicio es obligatoria")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido"),
    body("horaFin")
      .notEmpty()
      .withMessage("La hora de fin es obligatoria")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido"),
    body("estado")
      .isIn(["pendiente", "confirmada", "cancelada", "completada"])
      .withMessage("Estado inválido"),
    body("especialidad")
      .notEmpty()
      .withMessage("La especialidad es obligatoria"),
    body("notas").optional(),
    body("motivoConsulta").optional(),
  ],
  CitaController.crearCita
);

// Actualizar cita
router.put(
  "/actualizar/:id",
  [
    param("id").notEmpty().withMessage("El ID de la cita es obligatorio"),
    body("pacienteCedula").optional(),
    body("medicoCedula").optional(),
    body("fecha")
      .optional()
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
    body("horaInicio")
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido"),
    body("horaFin")
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Formato de hora inválido"),
    body("estado")
      .optional()
      .isIn(["pendiente", "confirmada", "cancelada", "completada"])
      .withMessage("Estado inválido"),
    body("especialidad").optional(),
    body("notas").optional(),
    body("motivoConsulta").optional(),
  ],
  CitaController.actualizarCita
);

// Cambiar estado de la cita
router.put(
  "/cambiar-estado/:id",
  [
    param("id").notEmpty().withMessage("El ID de la cita es obligatorio"),
    body("estado")
      .isIn(["pendiente", "confirmada", "cancelada", "completada"])
      .withMessage("Estado inválido"),
  ],
  CitaController.cambiarEstadoCita
);

// Obtener una cita específica
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("El ID de la cita es obligatorio")],
  CitaController.obtenerCita
);

// Listar citas (con filtros opcionales)
router.get(
  "/",
  [
    query("pacienteCedula").optional(),
    query("medicoCedula").optional(),
    query("estado")
      .optional()
      .isIn(["pendiente", "confirmada", "cancelada", "completada"])
      .withMessage("Estado inválido"),
    query("especialidad").optional(),
    query("fechaInicio")
      .optional()
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
    query("fechaFin")
      .optional()
      .isISO8601()
      .withMessage("Formato de fecha inválido"),
  ],
  CitaController.listarCitas
);

export default router;
