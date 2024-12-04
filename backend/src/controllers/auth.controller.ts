import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { logger } from "../utils/logger";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      console.log("Request body:", req.body);
      const token = await AuthService.register(req.body);
      res.status(201).json({ token });
    } catch (error: any) {
      logger.error("Registration error:", error);
      if (error.message === "User already exists") {
        res.status(409).json({ message: error.message });
      } else if (
        error.message === "Cédula is required and cannot be empty" ||
        error.message === "Password is required"
      ) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      console.log("Request body:", req.body);
      const { cedula, password } = req.body;
      const token = await AuthService.login(cedula, password);
      res.json({ token });
    } catch (error: any) {
      logger.error("Login error:", error);
      res.status(401).json({ message: error.message });
    }
  }
}
