import { Request, Response } from "express";
import { RecetaService } from "@/services/recetas.service";
import { logger } from "@/utils/logger";

export class RecetaController {
  /**
   * Crear una nueva receta
   */
  static async crear(req: Request, res: Response) {
    try {
      console.log(req.file, req.body);
      const { pacienteCedula, medicoCedula, medicamentos, fecha } = req.body;
      const pdfFile = req.file;

      if (!pdfFile) {
        return res.status(400).json({
          message: "No se ha proporcionado un archivo PDF",
        });
      }

      // Parsear medicamentos desde el body
      const medicamentosParsed = JSON.parse(medicamentos);

      const fechaCreacion = fecha ? new Date(fecha) : undefined;

      const receta = await RecetaService.crear(
        pacienteCedula,
        medicoCedula,
        medicamentosParsed,
        pdfFile,
        fechaCreacion
      );

      res.status(201).json(receta);
    } catch (error: any) {
      logger.error("Error al crear receta:", error);
      res.status(500).json({
        message: "Error al crear la receta",
        error: error.message,
      });
    }
  }

  /**
   * Obtener receta por ID
   */
  static async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const receta = await RecetaService.obtenerPorId(id);

      if (!receta) {
        return res.status(404).json({
          message: "Receta no encontrada",
        });
      }

      res.json(receta);
    } catch (error: any) {
      logger.error("Error al obtener receta:", error);
      res.status(500).json({
        message: "Error al obtener la receta",
        error: error.message,
      });
    }
  }

  /**
   * Listar recetas de un paciente
   */
  static async listarPorPaciente(req: Request, res: Response) {
    try {
      const { pacienteCedula } = req.params;
      const recetas = await RecetaService.listarPorPaciente(pacienteCedula);

      res.json(recetas);
    } catch (error: any) {
      logger.error("Error al listar recetas:", error);
      res.status(500).json({
        message: "Error al listar las recetas",
        error: error.message,
      });
    }
  }
}
