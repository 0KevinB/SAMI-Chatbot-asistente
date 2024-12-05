// Rutas de Autenticación
import { AuthController } from "@/controllers/auth.controller";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  [
    body("cedula")
      .notEmpty()
      .withMessage("La cédula es obligatoria")
      .isString()
      .withMessage("La cédula debe ser una cadena de texto"),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isString()
      .withMessage("El nombre debe ser una cadena de texto"),
    body("email").isEmail().withMessage("El formato del correo es inválido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres"),
    body("role")
      .isIn(["admin", "medico", "paciente"])
      .withMessage("El rol del usuario es inválido"),
  ],
  AuthController.register
);

router.post(
  "/login",
  [
    body("cedula").notEmpty().withMessage("La cédula es obligatoria"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  AuthController.login
);

export default router;
