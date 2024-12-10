import { db } from "@/config/firebase";
import { Medico } from "@/types";

export class MedicoService {
  /**
   * Obtiene todos los médicos del documento "users" filtrando por rol "medico".
   */
  static async getAllMedicos() {
    const snapshot = await db
      .collection("users")
      .where("role", "==", "medico")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Obtiene un médico por su ID desde el documento "users".
   */
  static async getMedicoById(id: string) {
    const medicoRef = db.collection("users").doc(id);
    const snapshot = await medicoRef.get();

    if (!snapshot.exists) {
      throw new Error("Médico no encontrado");
    }

    return { id: snapshot.id, ...snapshot.data() };
  }

  /**
   * Crea un nuevo médico en el documento "users" con rol "medico".
   */
  static async createMedico(medicoData: Partial<Medico>) {
    const medicoRef = db.collection("users").doc();
    const newMedico = {
      ...medicoData,
      role: "medico", // Aseguramos que el rol sea "medico"
      createdAt: new Date(),
    };
    await medicoRef.set(newMedico);
    return { id: medicoRef.id, ...newMedico };
  }

  /**
   * Actualiza los datos de un médico en el documento "users".
   */
  static async updateMedico(id: string, medicoData: Partial<Medico>) {
    const medicoRef = db.collection("users").doc(id);
    const snapshot = await medicoRef.get();

    if (!snapshot.exists) {
      throw new Error("Médico no encontrado");
    }

    const updatedData = {
      ...snapshot.data(),
      ...medicoData,
      updatedAt: new Date(),
    };
    await medicoRef.update(updatedData);
    return { id, ...updatedData };
  }

  /**
   * Elimina un médico del documento "users".
   */
  static async deleteMedico(id: string) {
    const medicoRef = db.collection("users").doc(id);
    const snapshot = await medicoRef.get();

    if (!snapshot.exists) {
      throw new Error("Médico no encontrado");
    }

    await medicoRef.delete();
  }
}
