import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CitaService } from "@/services/citas.service";

export class CitaController {
  static async crearCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const cita = await CitaService.crearCita(req.body);
      res.status(201).json({ mensaje: "Cita creada exitosamente", cita });
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async actualizarCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      const cita = await CitaService.actualizarCita(id, req.body);
      res.json({ mensaje: "Cita actualizada exitosamente", cita });
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async cambiarEstadoCita(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      const { estado } = req.body;
      const cita = await CitaService.cambiarEstadoCita(id, estado);
      res.json({ mensaje: `Cita ${estado} exitosamente`, cita });
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async obtenerCita(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await CitaService.obtenerCita(id);
      res.json(cita);
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async listarCitas(req: Request, res: Response) {
    try {
      // Lee los filtros enviados en el cuerpo de la solicitud
      const filtros = req.query;

      // Llama a la función listarCitas con los filtros
      const citas = await CitaService.listarCitas(filtros);

      // Devuelve las citas al cliente
      return res.status(200).json({
        message:
          Array.isArray(citas) && citas.length > 0
            ? "Citas encontradas"
            : "No se encontraron citas",
        total: Array.isArray(citas) ? citas.length : 0,
        citas: Array.isArray(citas) ? citas : [],
      });
    } catch (error) {
      console.error(
        "Error al listar citas:",
        error instanceof Error ? error.message : error
      );
      return res.status(500).json({
        message: "Ocurrió un error al intentar listar las citas",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
