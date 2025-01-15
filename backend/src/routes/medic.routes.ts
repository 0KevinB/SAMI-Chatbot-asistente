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
