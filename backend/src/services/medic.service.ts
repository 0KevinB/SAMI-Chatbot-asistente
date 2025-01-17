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
   * Obtiene un médico por su cédula desde la colección "users".
   */
  static async getMedicoByCedula(cedula: string) {
    const medicosRef = db.collection("users");
    const query = medicosRef.where("cedula", "==", cedula).limit(1);
    const snapshot = await query.get();

    if (snapshot.empty) {
      throw new Error("Médico no encontrado");
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  /**
   * Actualiza los datos de un médico en la colección "users" usando su cédula.
   */
  static async updateMedicoByCedula(
    cedula: string,
    medicoData: Partial<Medico>
  ) {
    const medicosRef = db.collection("users");
    const query = medicosRef.where("cedula", "==", cedula).limit(1);
    const snapshot = await query.get();

    if (snapshot.empty) {
      throw new Error("Médico no encontrado");
    }

    const doc = snapshot.docs[0];
    const updatedData = {
      ...doc.data(),
      ...medicoData,
      updatedAt: new Date(),
    };

    await doc.ref.update(updatedData);
    return { id: doc.id, ...updatedData };
  }

  /**
   * Elimina un médico de la colección "users" usando su cédula.
   */
  static async deleteMedicoByCedula(cedula: string) {
    const medicosRef = db.collection("users");
    const query = medicosRef.where("cedula", "==", cedula).limit(1);
    const snapshot = await query.get();

    if (snapshot.empty) {
      throw new Error("Médico no encontrado");
    }

    const doc = snapshot.docs[0];
    await doc.ref.delete();
  }
}
