// controllers/citas.controller.ts
import { Request, Response } from "express";
import { db } from "../config/firebase";
import { Cita, Medico } from "../types";

export class CitasController {
  static async crearCita(req: Request, res: Response) {
    try {
      const { pacienteCedula, especialidad, fecha, motivoConsulta } = req.body;

      // Buscar médicos disponibles con la especialidad requerida
      const medicosRef = db.collection("medicos");
      const medicosSnapshot = await medicosRef
        .where("especialidad", "==", especialidad)
        .get();

      if (medicosSnapshot.empty) {
        return res.status(404).json({
          message: "No hay médicos disponibles para esta especialidad",
        });
      }

      // Seleccionar un médico aleatoriamente (esto podría mejorarse con un algoritmo más sofisticado)
      const medicos = medicosSnapshot.docs.map((doc) => doc.data() as Medico);
      const medicoSeleccionado =
        medicos[Math.floor(Math.random() * medicos.length)];

      const nuevaCita: Cita = {
        id: db.collection("citas").doc().id,
        pacienteCedula,
        medicoCedula: medicoSeleccionado.cedula,
        fecha: new Date(fecha),
        estado: "pendiente",
        motivoConsulta,
        especialidad,
      };

      await db.collection("citas").doc(nuevaCita.id).set(nuevaCita);

      res.status(201).json(nuevaCita);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la cita", error });
    }
  }

  static async obtenerCitasMedico(req: Request, res: Response) {
    try {
      const { medicoCedula } = req.params;
      const citasRef = db.collection("citas");
      const snapshot = await citasRef
        .where("medicoCedula", "==", medicoCedula)
        .get();

      const citas = snapshot.docs.map((doc) => doc.data() as Cita);
      res.json(citas);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las citas", error });
    }
  }

  static async actualizarEstadoCita(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado, horaInicio, horaFin } = req.body;

      const citaRef = db.collection("citas").doc(id);
      const cita = await citaRef.get();

      if (!cita.exists) {
        return res.status(404).json({ message: "Cita no encontrada" });
      }

      await citaRef.update({ estado, horaInicio, horaFin });
      res.json({ message: "Cita actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la cita", error });
    }
  }
}
