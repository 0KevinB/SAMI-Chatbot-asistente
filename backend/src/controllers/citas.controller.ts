import { CitaService } from "@/services/citas.service";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

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

  static async aceptarCita(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      const { fecha, horaInicio, horaFin } = req.body;
      const cita = await CitaService.aceptarCita(
        id,
        fecha,
        horaInicio,
        horaFin
      );
      res.json({ mensaje: "Cita aceptada exitosamente", cita });
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async rechazarCita(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await CitaService.rechazarCita(id);
      res.json({ mensaje: "Cita rechazada exitosamente", cita });
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }
}
