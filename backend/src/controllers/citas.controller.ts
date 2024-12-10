import { CitasService } from "@/services/citas.service";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Controlador para gestionar operaciones de citas
 */
export class CitasController {
  /**
   * Crear una nueva cita
   */
  static async crearCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const cita = await CitasService.crearCita(req.body);
      res.status(201).json({
        mensaje: "Cita registrada exitosamente",
        cita,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al registrar cita",
      });
    }
  }

  /**
   * Obtener todas las citas
   */
  static async obtenerCitas(req: Request, res: Response, next: NextFunction) {
    try {
      const citas = await CitasService.obtenerCitas();
      res.json({
        mensaje: "Citas obtenidas exitosamente",
        citas,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al obtener citas",
      });
    }
  }

  /**
   * Obtener una cita por su ID
   */
  static async obtenerCitaPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const cita = await CitasService.obtenerCitaPorId(req.params.id);
      res.json({
        mensaje: "Cita obtenida exitosamente",
        cita,
      });
    } catch (error: any) {
      res.status(error.status || 404).json({
        mensaje: error.message || "Cita no encontrada",
      });
    }
  }

  /**
   * Obtener citas por médico
   */
  static async obtenerCitasPorMedico(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const citas = await CitasService.obtenerCitasPorMedico(
        req.params.medicoId
      );
      res.json({
        mensaje: "Citas del médico obtenidas exitosamente",
        citas,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al obtener citas del médico",
      });
    }
  }

  /**
   * Obtener citas por paciente
   */
  static async obtenerCitasPorPaciente(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const citas = await CitasService.obtenerCitasPorPaciente(
        req.params.pacienteId
      );
      res.json({
        mensaje: "Citas del paciente obtenidas exitosamente",
        citas,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al obtener citas del paciente",
      });
    }
  }

  /**
   * Actualizar una cita
   */
  static async actualizarCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const cita = await CitasService.actualizarCita(req.params.id, req.body);
      res.json({
        mensaje: "Cita actualizada exitosamente",
        cita,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al actualizar cita",
      });
    }
  }

  /**
   * Eliminar una cita
   */
  static async eliminarCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      await CitasService.eliminarCita(req.params.id);
      res.json({
        mensaje: "Cita eliminada exitosamente",
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        mensaje: error.message || "Error al eliminar cita",
      });
    }
  }
}
