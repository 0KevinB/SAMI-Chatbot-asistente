import { db } from "@/config/firebase";
import { Cita, Medico } from "@/types";
import { FieldValue } from "firebase-admin/firestore";
import { Query } from "firebase-admin/firestore";

export class CitaService {
  static async crearCita(data: Omit<Cita, "id" | "createdAt">) {
    const citaRef = db.collection("citas").doc();
    const nuevaCita: Cita = {
      id: citaRef.id,
      ...data,
    };

    await citaRef.set(nuevaCita);

    // Actualizar el documento del médico
    await db
      .collection("users")
      .doc(data.medicoCedula)
      .update({
        citasMedicas: FieldValue.arrayUnion(nuevaCita),
      });

    return nuevaCita;
  }

  static async actualizarCita(id: string, data: Partial<Cita>) {
    const citaRef = db.collection("citas").doc(id);
    const cita = await citaRef.get();

    if (!cita.exists) {
      throw new Error("Cita no encontrada");
    }

    const citaActual = cita.data() as Cita;
    const citaActualizada = { ...citaActual, ...data };

    await citaRef.update(citaActualizada);

    // Actualizar el documento del médico
    await this.actualizarCitaMedico(citaActual, citaActualizada);

    return citaActualizada;
  }

  static async cambiarEstadoCita(id: string, estado: Cita["estado"]) {
    const citaRef = db.collection("citas").doc(id);
    const cita = await citaRef.get();

    if (!cita.exists) {
      throw new Error("Cita no encontrada");
    }

    const citaActual = cita.data() as Cita;
    const citaActualizada = { ...citaActual, estado };

    await citaRef.update({ estado });

    // Actualizar el documento del médico
    await this.actualizarCitaMedico(citaActual, citaActualizada);

    return citaActualizada;
  }

  static async obtenerCita(id: string) {
    const citaRef = db.collection("citas").doc(id);
    const cita = await citaRef.get();

    if (!cita.exists) {
      throw new Error("Cita no encontrada");
    }

    return cita.data() as Cita;
  }

  static async listarCitas(
    filtros: Partial<Cita> & { fechaInicio?: string; fechaFin?: string }
  ) {
    let query: Query = db.collection("citas"); // Declara query explícitamente como tipo Query

    if (filtros.pacienteCedula) {
      query = query.where("pacienteCedula", "==", filtros.pacienteCedula);
    }
    if (filtros.medicoCedula) {
      query = query.where("medicoCedula", "==", filtros.medicoCedula);
    }
    if (filtros.estado) {
      query = query.where("estado", "==", filtros.estado);
    }
    if (filtros.especialidad) {
      query = query.where("especialidad", "==", filtros.especialidad);
    }
    if (filtros.fechaInicio) {
      query = query.where("fecha", ">=", filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query = query.where("fecha", "<=", filtros.fechaFin);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as Cita);
  }

  private static async actualizarCitaMedico(
    citaAnterior: Cita,
    citaNueva: Cita
  ) {
    const medicoRef = db.collection("users").doc(citaNueva.medicoCedula);
    const medicoDoc = await medicoRef.get();

    if (!medicoDoc.exists) {
      throw new Error("Médico no encontrado");
    }

    const medico = medicoDoc.data() as Medico;

    // En lugar de almacenar toda la cita, solo se almacenará el ID de la cita
    const citasActualizadas = medico.citasMedicas.map((cita) =>
      cita.id === citaNueva.id ? { id: citaNueva.id } : cita
    );

    await medicoRef.update({
      citasMedicas: citasActualizadas,
    });
  }
}
