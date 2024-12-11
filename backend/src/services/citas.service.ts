import { db } from "@/config/firebase";

export class CitaService {
  static async crearCita(data: any) {
    const { usuarioCedula, medicoCedula, estado } = data;
    const citaRef = db.collection("citas").doc();
    const nuevaCita = {
      id: citaRef.id,
      usuarioCedula,
      medicoCedula,
      estado,
      fecha: null,
      horaInicio: null,
      horaFin: null,
      createdAt: new Date().toISOString(),
    };
    await citaRef.set(nuevaCita);
    return nuevaCita;
  }

  static async aceptarCita(
    id: string,
    fecha: string,
    horaInicio: string,
    horaFin: string
  ) {
    const citaRef = db.collection("citas").doc(id);
    const cita = await citaRef.get();

    if (!cita.exists) {
      throw new Error("Cita no encontrada");
    }

    const citaData = cita.data();
    if (citaData?.estado !== "pendiente") {
      throw new Error("Solo las citas pendientes pueden ser aceptadas");
    }

    const updatedCita = {
      ...citaData,
      estado: "aceptada",
      fecha,
      horaInicio,
      horaFin,
    };

    await citaRef.update(updatedCita);

    // Actualizar disponibilidad del médico
    const medicoRef = db.collection("medicos").doc(citaData.medicoCedula);
    const medico = await medicoRef.get();

    if (medico.exists) {
      const horarioDisponible = medico.data()?.horarioDisponible || [];
      const nuevoHorario = horarioDisponible.filter(
        (horario: any) =>
          horario.inicio !== horaInicio && horario.fin !== horaFin
      );
      await medicoRef.update({ horarioDisponible: nuevoHorario });
    }

    return updatedCita;
  }

  static async rechazarCita(id: string) {
    const citaRef = db.collection("citas").doc(id);
    const cita = await citaRef.get();

    if (!cita.exists) {
      throw new Error("Cita no encontrada");
    }

    const citaData = cita.data();
    const updatedCita = {
      ...citaData,
      estado: "rechazada",
    };

    await citaRef.update(updatedCita);
    return updatedCita;
  }
}
