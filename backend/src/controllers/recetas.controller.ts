import { Request, Response } from "express";
import { RecetaService } from "@/services/recetas.service";
import { logger } from "@/utils/logger";

/**
 * Controlador para gestionar las operaciones relacionadas con las recetas médicas
 */
export class RecetaController {
  /**
   * Crear una nueva receta médica
   * @param req Objeto Request que contiene los datos de la receta en el body y el archivo PDF en el campo `file`
   * @param res Objeto Response que devolverá el resultado de la operación
   * @returns Receta creada con los datos proporcionados
   */
  static async crear(req: Request, res: Response) {
    try {
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
   * Obtener una receta por su ID
   * @param req Objeto Request que contiene el ID de la receta en los parámetros
   * @param res Objeto Response que devolverá la receta o un error si no se encuentra
   * @returns Receta correspondiente al ID proporcionado, o mensaje de error si no se encuentra
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
   * Listar todas las recetas de un paciente
   * @param req Objeto Request que contiene la cédula del paciente en los parámetros
   * @param res Objeto Response que devolverá la lista de recetas o un error si ocurre uno
   * @returns Lista de recetas asociadas al paciente proporcionado
   */
  static async listarPorPaciente(req: Request, res: Response) {
    try {
      const { pacienteCedula } = req.params;
      const recetas = await RecetaService.listarPorPacienteCedula(
        pacienteCedula
      );

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
