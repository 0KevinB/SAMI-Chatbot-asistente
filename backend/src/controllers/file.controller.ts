import { Request, Response } from "express";
import { FileService } from "../services/file.service";

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

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
