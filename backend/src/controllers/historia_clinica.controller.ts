import { Request, Response } from "express";
import { HistoriaClinicaService } from "@/services/historia_clinica.service";
import { logger } from "@/utils/logger";

export class HistoriaClinicaController {
  static async crear(req: Request, res: Response) {
    try {
      console.log(req.file, req.body);
      const { pacienteCedula, medicoCedula, descripcion, fecha } = req.body;
      const pdfFile = req.file;

      if (!pdfFile) {
        return res
          .status(400)
          .json({ message: "No se ha proporcionado un archivo PDF" });
      }

      const fechaCreacion = fecha ? new Date(fecha) : undefined;

      const historiaClinica = await HistoriaClinicaService.crear(
        pacienteCedula,
        medicoCedula,
        descripcion,
        pdfFile,
        fechaCreacion
      );

      res.status(201).json(historiaClinica);
    } catch (error: any) {
      logger.error("Error al crear historia clínica:", error);
      res.status(500).json({
        message: "Error al crear la historia clínica",
        error: error.message,
      });
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const historiaClinica = await HistoriaClinicaService.obtenerPorId(id);

      if (!historiaClinica) {
        return res
          .status(404)
          .json({ message: "Historia clínica no encontrada" });
      }

      res.json(historiaClinica);
    } catch (error: any) {
      logger.error("Error al obtener historia clínica:", error);
      res.status(500).json({
        message: "Error al obtener la historia clínica",
        error: error.message,
      });
    }
  }

  // Puedes agregar más métodos según sea necesario
}
