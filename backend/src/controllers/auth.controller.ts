import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Controlador para gestionar la autenticación de usuarios
 */
export class AuthController {
  /**
   * Registro de usuario con validación de express-validator
   * @param req Objeto Request que contiene los datos del usuario a registrar
   * @param res Objeto Response que devolverá un mensaje de éxito o error
   * @param next Función para pasar al siguiente middleware en caso de error
   * @returns Mensaje de éxito con el token generado, o errores de validación
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const token = await AuthService.register(req.body);
      res.status(201).json({
        mensaje: "Usuario registrado exitosamente",
        token,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "El registro falló",
      });
    }
  }

  /**
   * Login de usuario con validación de express-validator
   * @param req Objeto Request que contiene los datos de inicio de sesión (cedula y contraseña)
   * @param res Objeto Response que devolverá un mensaje de éxito con el token de autenticación o un error
   * @param next Función para pasar al siguiente middleware en caso de error
   * @returns Mensaje de éxito con el token generado o un error de autenticación
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { cedula, password } = req.body;
      const token = await AuthService.login(cedula, password);

      res.json({
        mensaje: "Inicio de sesión exitoso",
        token,
      });
    } catch (error: any) {
      res.status(401).json({
        mensaje: error.message || "La autenticación falló",
      });
    }
  }
}
