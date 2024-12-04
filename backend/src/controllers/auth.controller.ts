// Controlador de Autenticación
import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export class AuthController {
  /**
   * Registro de usuario con validación de express-validator
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const token = await AuthService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
        token,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Registration failed",
      });
    }
  }

  /**
   * Login de usuario con validación de express-validator
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { cedula, password } = req.body;
      const token = await AuthService.login(cedula, password);

      res.json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      res.status(401).json({
        message: error.message || "Authentication failed",
      });
    }
  }
}
