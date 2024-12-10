import { Router } from "express";
import { body, param } from "express-validator";
import { MedicoController } from "@/controllers/medic.controller";

const router = Router();

router.get("/", MedicoController.getAllMedicos);

router.get(
  "/:id",
  [param("id").isString().withMessage("El ID debe ser una cadena de texto")],
  MedicoController.getMedicoById
);

router.post(
  "/",
  [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isString()
      .withMessage("El nombre debe ser una cadena de texto"),
    body("especialidad")
      .notEmpty()
      .withMessage("La especialidad es obligatoria")
      .isString()
      .withMessage("La especialidad debe ser una cadena de texto"),
    body("cedula")
      .notEmpty()
      .withMessage("La cédula es obligatoria")
      .isString()
      .withMessage("La cédula debe ser una cadena de texto"),
  ],
  MedicoController.createMedico
);

router.put(
  "/:id",
  [
    param("id").isString().withMessage("El ID debe ser una cadena de texto"),
    body("nombre")
      .optional()
      .isString()
      .withMessage("El nombre debe ser una cadena de texto"),
    body("especialidad")
      .optional()
      .isString()
      .withMessage("La especialidad debe ser una cadena de texto"),
  ],
  MedicoController.updateMedico
);

router.delete(
  "/:id",
  [param("id").isString().withMessage("El ID debe ser una cadena de texto")],
  MedicoController.deleteMedico
);

export default router;
