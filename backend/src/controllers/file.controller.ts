import { Request, Response } from "express";
import { FileService } from "@/services/file.service";

/**
 * Controlador para gestionar las operaciones relacionadas con los archivos
 */
export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  /**
   * Obtener todos los archivos almacenados, opcionalmente filtrados por un prefijo
   * @param req Objeto Request que puede contener un parámetro de consulta `prefix` para filtrar los archivos
   * @param res Objeto Response que devolverá los archivos obtenidos o un error
   * @returns Lista de archivos almacenados que coinciden con el prefijo, o mensaje de error
   */
  async getAllFiles(req: Request, res: Response) {
    try {
      const prefix = req.query.prefix as string | undefined;
      const files = await this.fileService.listFiles(prefix);

      res.status(200).json({
        message: "Archivos obtenidos exitosamente",
        files: files,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener archivos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtener la URL de un archivo específico
   * @param req Objeto Request que contiene el nombre del archivo en los parámetros de la URL
   * @param res Objeto Response que devolverá la URL firmada del archivo o un error
   * @returns URL firmada del archivo, o mensaje de error
   */
  async getFileUrl(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const fileUrl = await this.fileService.getFileUrl(fileName);

      res.status(200).json({
        message: "URL del archivo obtenida exitosamente",
        url: fileUrl,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener URL del archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * Obtener la URL pública de un archivo específico
   * @param req Objeto Request que contiene el nombre del archivo en los parámetros de la URL
   * @param res Objeto Response que devolverá la URL pública del archivo o un error
   * @returns URL pública del archivo, o mensaje de error
   */
  async getPublicFileUrl(req: Request, res: Response) {
    try {
      const fileName = req.params.fileName;
      const fileUrl = await this.fileService.getPublicUrl(fileName);

      res.status(200).json({
        message: "URL pública obtenida exitosamente",
        url: fileUrl,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener URL pública",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
