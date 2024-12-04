import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  [
    body("cedula").notEmpty().isString(),
    body("nombre").notEmpty().isString(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["admin", "medico", "paciente"]),
  ],
  AuthController.register
);

router.post(
  "/login",
  [body("cedula").notEmpty(), body("password").notEmpty()],
  AuthController.login
);

export default router;
