import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase";
import { User } from "../types";
import { Timestamp } from "firebase-admin/firestore";

export class AuthService {
  static async register(userData: Partial<User>) {
    if (!userData.cedula || userData.cedula.trim() === "") {
      throw new Error("Cédula is required and cannot be empty");
    }

    const userRef = db.collection("users").doc(userData.cedula);
    const snapshot = await userRef.get();

    if (snapshot.exists) {
      throw new Error("User already exists");
    }

    if (!userData.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await userRef.set(newUser);
    return this.generateToken(newUser);
  }

  static async login(cedula: string, password: string) {
    const userRef = db.collection("users").doc(cedula); // Cambiado a Firestore
    const snapshot = await userRef.get(); // Usar get() para Firestore

    if (!snapshot.exists) {
      throw new Error("User not found");
    }

    const user = snapshot.data() as User; // Obtener los datos del usuario

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return this.generateToken(user);
  }

  private static generateToken(user: Partial<User>) {
    return jwt.sign(
      {
        cedula: user.cedula,
        role: user.role,
        nombre: user.nombre,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
  }
}
