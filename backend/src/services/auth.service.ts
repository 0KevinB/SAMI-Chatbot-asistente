import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/config/firebase";
import { User } from "@/types";
import { Timestamp } from "firebase-admin/firestore";

export class AuthService {
  /**
   * Registra un nuevo usuario con validaciones adicionales
   * @param userData Datos parciales del usuario a registrar
   * @returns Token de autenticación
   */
  static async register(userData: Partial<User>) {
    // Validaciones exhaustivas
    this.validateRegistrationData(userData);
    if (!userData.cedula || userData.cedula.trim() === "") {
      throw new Error("Cédula is required and cannot be empty");
    }
    const userRef = db.collection("users").doc(userData.cedula);
    const snapshot = await userRef.get();

    if (snapshot.exists) {
      throw new Error("User already exists");
    }

    // Hash de contraseña con salt adicional
    const hashedPassword = await bcrypt.hash(userData.password!, 12);

    // Preparar datos del usuario con timestamps
    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Guardar usuario y generar token
    await userRef.set(newUser);
    return this.generateToken(newUser);
  }

  /**
   * Inicio de sesión con validaciones de seguridad
   * @param cedula Identificador único del usuario
   * @param password Contraseña sin hashear
   * @returns Token de autenticación
   */
  static async login(cedula: string, password: string) {
    const userRef = db.collection("users").doc(cedula);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      throw new Error("User not found");
    }

    const user = snapshot.data() as User;

    // Comparación de contraseña con tiempo constante
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generar token con información mínima necesaria
    return this.generateToken(user);
  }

  /**
   * Genera un token JWT con información esencial
   * @param user Datos del usuario para tokenización
   * @returns Token firmado
   */
  private static generateToken(user: Partial<User>) {
    return jwt.sign(
      {
        cedula: user.cedula,
        role: user.role,
        nombre: user.nombre,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "24h",
        algorithm: "HS256", // Algoritmo de firma explícito
      }
    );
  }

  /**
   * Validaciones detalladas para datos de registro
   * @param userData Datos del usuario a validar
   */
  private static validateRegistrationData(userData: Partial<User>) {
    // Validación de cédula
    if (!userData.cedula || userData.cedula.trim() === "") {
      throw new Error("Cédula is required and cannot be empty");
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    // Validación de contraseña
    if (!userData.password || userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validación de rol
    const validRoles = ["admin", "medico", "paciente"];
    if (!userData.role || !validRoles.includes(userData.role)) {
      throw new Error("Invalid user role");
    }

    // Validación de nombre
    if (!userData.nombre || userData.nombre.trim() === "") {
      throw new Error("Name is required");
    }
  }

  /**
   * Método para recuperar información de usuario por cédula
   * @param cedula Identificador único del usuario
   * @returns Datos del usuario sin contraseña
   */
  static async getUserInfo(cedula: string) {
    const userRef = db.collection("users").doc(cedula);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      throw new Error("User not found");
    }

    const userData = snapshot.data() as User;

    // Remover información sensible antes de retornar
    const { password, ...userInfo } = userData;
    return userInfo;
  }
}
