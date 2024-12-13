import { db } from "@/config/firebase";
import { Paciente } from "@/types";

export class PatientService {
  /**
   * Obtiene todos los pacientes del documento "users" filtrando por rol "paciente".
   */
  static async getAllPatients() {
    const snapshot = await db
      .collection("users")
      .where("role", "==", "paciente")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Obtiene un paciente por su ID desde el documento "users".
   */
  static async getPatientById(id: string) {
    const patientRef = db.collection("users").doc(id);
    const snapshot = await patientRef.get();

    if (!snapshot.exists) {
      throw new Error("Paciente no encontrado");
    }

    return { id: snapshot.id, ...snapshot.data() };
  }

  /**
   * Crea un nuevo paciente en el documento "users" con rol "paciente".
   */
  static async createPatient(patientData: Partial<Paciente>) {
    const patientRef = db.collection("users").doc();
    const newPatient = {
      ...patientData,
      role: "paciente", // Aseguramos que el rol sea "paciente"
      createdAt: new Date(),
    };
    await patientRef.set(newPatient);
    return { id: patientRef.id, ...newPatient };
  }

  /**
   * Actualiza los datos de un paciente en el documento "users".
   */
  static async updatePatient(id: string, patientData: Partial<Paciente>) {
    const patientRef = db.collection("users").doc(id);
    const snapshot = await patientRef.get();

    if (!snapshot.exists) {
      throw new Error("Paciente no encontrado");
    }

    const updatedData = {
      ...snapshot.data(),
      ...patientData,
      updatedAt: new Date(),
    };
    await patientRef.update(updatedData);
    return { id, ...updatedData };
  }

  /**
   * Elimina un paciente del documento "users".
   */
  static async deletePatient(id: string) {
    const patientRef = db.collection("users").doc(id);
    const snapshot = await patientRef.get();

    if (!snapshot.exists) {
      throw new Error("Paciente no encontrado");
    }

    await patientRef.delete();
  }
}
