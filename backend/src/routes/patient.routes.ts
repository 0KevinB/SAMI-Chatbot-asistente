import { Router } from "express";
import { body, param } from "express-validator";
import { PatientController } from "@/controllers/pateint.controller";

const router = Router();

router.get("/", PatientController.getAllPatients);

router.get(
  "/:id",
  [param("id").isString().withMessage("El ID debe ser una cadena de texto")],
  PatientController.getPatientById
);

router.put(
  "/:id",
  [
    param("id").isString().withMessage("El ID debe ser una cadena de texto"),
    body("nombre")
      .optional()
      .isString()
      .withMessage("El nombre debe ser una cadena de texto"),
    body("apellido")
      .optional()
      .isString()
      .withMessage("El apellido debe ser una cadena de texto"),
    body("fechaNacimiento")
      .optional()
      .isDate()
      .withMessage("La fecha de nacimiento debe tener un formato válido"),
    body("cedula")
      .optional()
      .isString()
      .withMessage("La cédula debe ser una cadena de texto"),
  ],
  PatientController.updatePatient
);

router.delete(
  "/:id",
  [param("id").isString().withMessage("El ID debe ser una cadena de texto")],
  PatientController.deletePatient
);

router.post("/:patientId/glucosa", PatientController.addGlucosaRecord);

export default router;
