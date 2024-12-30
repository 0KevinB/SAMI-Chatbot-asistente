import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "@/config/firebase";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Adjuntar solo la cédula al request, no es necesario buscar en Firestore
    req.user = { cedula: decoded.cedula };

    next(); // Continuar con el siguiente middleware/controlador
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
