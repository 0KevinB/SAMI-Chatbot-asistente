import { db } from "@/config/firebase";
import { GlucosaRecord, Paciente } from "@/types";
import { log } from "console";
import { firestore } from "firebase-admin"; // Importación correcta

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
    // Primero, intentamos buscar por ID
    const patientRef = db.collection("users").doc(id);
    const snapshot = await patientRef.get();

    if (snapshot.exists) {
      return { id: snapshot.id, ...snapshot.data() };
    }

    // Si no se encuentra por ID, buscamos por cédula
    const querySnapshot = await db
      .collection("users")
      .where("cedula", "==", id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      throw new Error("Paciente no encontrado");
    }

    const patientDoc = querySnapshot.docs[0];
    return { id: patientDoc.id, ...patientDoc.data() };
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

  static async addGlucosaRecord(cedula: string, glucosaRecord: GlucosaRecord) {
    try {
      // Primero buscamos al paciente por cédula
      const querySnapshot = await db
        .collection("users")
        .where("cedula", "==", cedula)
        .where("role", "==", "paciente")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        throw new Error(`No se encontró paciente con cédula ${cedula}`);
      }

      // Obtener la referencia del primer (y único) documento encontrado
      const patientRef = querySnapshot.docs[0].ref;
      const patientId = querySnapshot.docs[0].id;

      // Añadir el nuevo registro de glucosa al array de nivelesGlucosa
      await patientRef.update({
        nivelesGlucosa: firestore.FieldValue.arrayUnion({
          valor: glucosaRecord.valor,
          fecha: glucosaRecord.fecha || new Date(),
          contexto: glucosaRecord.contexto || "aleatorio",
          unidad: glucosaRecord.unidad || "mg/dL",
          notas: glucosaRecord.notas || "",
        }),
      });

      // Recuperar el documento actualizado para devolver el paciente completo
      const updatedPatientDoc = await patientRef.get();
      return {
        id: patientId,
        ...updatedPatientDoc.data(),
      };
    } catch (error: unknown) {
      // Manejo de error tipado correctamente
      if (error instanceof Error) {
        throw new Error(
          `Error al agregar registro de glucosa: ${error.message}`
        );
      }
      throw new Error(`Error desconocido al agregar registro de glucosa`);
    }
  }
}
