import { db } from "@/config/firebase";
import { Cita, Medico, Paciente } from "@/types";
import { Timestamp } from "firebase-admin/firestore";

export class CitasService {
  /**
   * Crear una nueva cita
   * @param citaData Datos de la cita a registrar
   * @returns Datos de la cita creada
   */
  static async crearCita(citaData: Partial<Cita>) {
    // Validaciones
    await this.validateCitaData(citaData);

    // Verificar disponibilidad del médico y paciente
    await this.verificarDisponibilidad(citaData);

    const citaRef = db.collection("citas").doc();
    const nuevaCita = {
      ...citaData,
      id: citaRef.id,
      estado: "programada",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await citaRef.set(nuevaCita);
    return nuevaCita;
  }

  /**
   * Obtener todas las citas
   * @returns Lista de citas
   */
  static async obtenerCitas() {
    const citasRef = db.collection("citas");
    const snapshot = await citasRef.get();

    const citas: Cita[] = [];
    snapshot.forEach((doc) => {
      citas.push(doc.data() as Cita);
    });

    return citas;
  }

  /**
   * Obtener una cita por su ID
   * @param id Identificador único de la cita
   * @returns Datos de la cita
   */
  static async obtenerCitaPorId(id: string) {
    const citaRef = db.collection("citas").doc(id);
    const snapshot = await citaRef.get();

    if (!snapshot.exists) {
      throw new Error("Cita no encontrada");
    }

    return snapshot.data() as Cita;
  }

  /**
   * Obtener citas por médico
   * @param medicoCedula Identificador del médico
   * @returns Lista de citas del médico
   */
  static async obtenerCitasPorMedico(medicoCedula: string) {
    const citasRef = db.collection("citas");
    const snapshot = await citasRef
      .where("medicoCedula", "==", medicoCedula)
      .get();

    const citas: Cita[] = [];
    snapshot.forEach((doc) => {
      citas.push(doc.data() as Cita);
    });

    return citas;
  }

  /**
   * Obtener citas por paciente
   * @param pacienteCedula Identificador del paciente
   * @returns Lista de citas del paciente
   */
  static async obtenerCitasPorPaciente(pacienteCedula: string) {
    const citasRef = db.collection("citas");
    const snapshot = await citasRef
      .where("pacienteCedula", "==", pacienteCedula)
      .get();

    const citas: Cita[] = [];
    snapshot.forEach((doc) => {
      citas.push(doc.data() as Cita);
    });

    return citas;
  }

  /**
   * Actualizar datos de una cita
   * @param id Identificador único de la cita
   * @param citaData Datos a actualizar
   * @returns Datos actualizados de la cita
   */
  static async actualizarCita(id: string, citaData: Partial<Cita>) {
    const citaRef = db.collection("citas").doc(id);
    const snapshot = await citaRef.get();

    if (!snapshot.exists) {
      throw new Error("Cita no encontrada");
    }

    // Si se cambia la fecha/hora, verificar disponibilidad
    if (citaData.fecha) {
      await this.verificarDisponibilidad({
        ...snapshot.data(),
        ...citaData,
      });
    }

    const citaActualizada = {
      ...snapshot.data(),
      ...citaData,
      updatedAt: Timestamp.now(),
    };

    await citaRef.update(citaActualizada);
    return citaActualizada;
  }

  /**
   * Eliminar una cita
   * @param id Identificador único de la cita
   */
  static async eliminarCita(id: string) {
    const citaRef = db.collection("citas").doc(id);
    const snapshot = await citaRef.get();

    if (!snapshot.exists) {
      throw new Error("Cita no encontrada");
    }

    await citaRef.delete();
  }

  /**
   * Validaciones de datos de cita
   * @param citaData Datos a validar
   */
  private static async validateCitaData(citaData: Partial<Cita>) {
    // Validar médico

    if (!citaData.medicoCedula) {
      throw new Error("El ID del médico es obligatorio");
    }
    const medicoRef = db.collection("medicos").doc(citaData.medicoCedula);
    const medicoSnapshot = await medicoRef.get();
    if (!medicoSnapshot.exists) {
      throw new Error("Médico no encontrado");
    }

    // Validar paciente
    if (!citaData.pacienteCedula) {
      throw new Error("El ID del paciente es obligatorio");
    }
    const pacienteRef = db.collection("pacientes").doc(citaData.pacienteCedula);
    const pacienteSnapshot = await pacienteRef.get();
    if (!pacienteSnapshot.exists) {
      throw new Error("Paciente no encontrado");
    }

    // Validar fecha
    if (!citaData.fecha) {
      throw new Error("La fecha de la cita es obligatoria");
    }
    const fechaCita = new Date(citaData.fecha);
    if (isNaN(fechaCita.getTime())) {
      throw new Error("Formato de fecha inválido");
    }

    // Validar hora
    if (!citaData.fecha.toTimeString().split(" ")[0]) {
      throw new Error("La hora de la cita es obligatoria");
    }
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!horaRegex.test(citaData.fecha.toTimeString().split(" ")[0])) {
      throw new Error("Formato de hora inválido (HH:MM)");
    }
  }

  /**
   * Verificar disponibilidad de médico y paciente
   * @param citaData Datos de la cita a verificar
   */
  private static async verificarDisponibilidad(citaData: Partial<Cita>) {
    const citasRef = db.collection("citas");

    // Verificar citas del médico en la misma fecha y hora
    const medicoSnapshot = await citasRef
      .where("medicoCedula", "==", citaData.medicoCedula)
      .where("fecha", "==", citaData.fecha)
      .get();

    if (!medicoSnapshot.empty) {
      throw new Error(
        "El médico ya tiene una cita programada en esta fecha y hora"
      );
    }

    // Verificar citas del paciente en la misma fecha y hora
    const pacienteSnapshot = await citasRef
      .where("pacienteCedula", "==", citaData.pacienteCedula)
      .where("fecha", "==", citaData.fecha)
      .get();

    if (!pacienteSnapshot.empty) {
      throw new Error(
        "El paciente ya tiene una cita programada en esta fecha y hora"
      );
    }
  }
}
