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

    // Acceder al documento del usuario en Firestore
    const userRef = db.collection("users").doc(decoded.cedula);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = snapshot.data(); // Obtén los datos del usuario
    req.user = user; // Guarda el usuario en la solicitud
    next(); // Continua con la siguiente acción
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const roleCheck = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next(); // Continúa si el rol es válido
  };
};
