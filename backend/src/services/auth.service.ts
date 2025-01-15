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

  /**
   * Registra un nuevo usuario con validaciones adicionales
   * @param userData Datos parciales del usuario a registrar
   * @returns Token de autenticación
   */
  static async register(userData: Partial<User>) {
    // Validaciones exhaustivas
    this.validateRegistrationData(userData);
    if (!userData.cedula || userData.cedula.trim() === "") {
      throw new Error("La cédula es obligatoria y no puede estar vacía");
    }

    // Verificar si ya existe un usuario con la misma cédula
    const querySnapshot = await db
      .collection("users")
      .where("cedula", "==", userData.cedula)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      throw new Error("El usuario ya existe");
    }

    // Hash de contraseña con salt adicional
    const hashedPassword = await bcrypt.hash(userData.password!, 12);

    // Generar un ID aleatorio o usar el ID automático de Firestore
    const documentId = db.collection("users").doc().id;

    // Preparar datos del usuario con timestamps
    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Guardar usuario en Firestore
    await db.collection("users").doc(documentId).set(newUser);

    // Generar token y retornarlo
    return this.generateToken(newUser);
  }

  /**
   * Inicio de sesión con validaciones de seguridad
   * @param cedula Identificador único del usuario
   * @param password Contraseña sin hashear
   * @returns Token de autenticación
   */
  static async login(cedula: string, password: string) {
    const userRef = db
      .collection("users")
      .where("cedula", "==", cedula)
      .limit(1); // Limitar la búsqueda a un solo documento

    const snapshot = await userRef.get();

    if (snapshot.empty) {
      throw new Error("Usuario no encontrado");
    }

    const user = snapshot.docs[0].data() as User;

    // Comparación de contraseña con tiempo constante
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Credenciales inválidas");
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
      throw new Error("La cédula es obligatoria y no puede estar vacía");
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      throw new Error("El formato del correo es inválido");
    }

    // Validación de contraseña
    if (!userData.password || userData.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    // Validación de rol
    const validRoles = ["admin", "medico", "paciente"];
    if (!userData.role || !validRoles.includes(userData.role)) {
      throw new Error("El rol del usuario es inválido");
    }

    // Validación de nombre
    if (!userData.nombre || userData.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio");
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
      throw new Error("Usuario no encontrado");
    }

    const userData = snapshot.data() as User;

    // Remover información sensible antes de retornar
    const { password, ...userInfo } = userData;
    return userInfo;
  }
}
