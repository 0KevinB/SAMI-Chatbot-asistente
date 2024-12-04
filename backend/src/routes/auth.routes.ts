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
      .withMessage("Cédula is required")
      .isString()
      .withMessage("Cédula must be a string"),
    body("nombre")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .isIn(["admin", "medico", "paciente"])
      .withMessage("Invalid user role"),
  ],
  AuthController.register
);

router.post(
  "/login",
  [
    body("cedula").notEmpty().withMessage("Cédula is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AuthController.login
);

export default router;
