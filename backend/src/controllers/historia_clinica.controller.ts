import { Request, Response } from "express";
import { HistoriaClinicaService } from "@/services/historia_clinica.service";
import { logger } from "@/utils/logger";

/**
 * Controlador para gestionar las operaciones relacionadas con las historias clínicas
 */
export class HistoriaClinicaController {
  /**
   * Crear una nueva historia clínica
   * @param req Objeto Request que contiene los datos de la historia clínica en el body y el archivo PDF en el campo `file`
   * @param res Objeto Response que devolverá el resultado de la operación
   * @returns Historia clínica creada con los datos proporcionados
   */
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

  /**
   * Obtener historia clínica por ID
   * @param req Objeto Request que contiene el ID de la historia clínica en los parámetros
   * @param res Objeto Response que devolverá la historia clínica o un error si no se encuentra
   * @returns Historia clínica correspondiente al ID proporcionado, o mensaje de error si no se encuentra
   */
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
