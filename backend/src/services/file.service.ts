import * as admin from "firebase-admin";

/**
 * Servicio para gestionar archivos en Firebase Storage
 */
export class FileService {
  /**
   * Listar los archivos en Firebase Storage con un prefijo opcional
   * @param prefix Prefijo opcional para filtrar los archivos
   * @returns Lista de archivos con nombre, tamaño y fecha de actualización
   */
  async listFiles(prefix?: string) {
    try {
      // Obtener el bucket por defecto
      const bucket = admin.storage().bucket();

      // Usa un valor por defecto si prefix es undefined
      const filesPrefix = prefix || "";

      const [files] = await bucket.getFiles({ prefix: filesPrefix });
      return files.map((file) => ({
        name: file.name,
        size: file.metadata.size,
        updated: file.metadata.updated,
      }));
    } catch (error) {
      console.error("Error en el servicio de archivos:", error);
      throw error;
    }
  }

  /**
   * Obtener la URL firmada de un archivo por su nombre
   * @param fileName Nombre del archivo
   * @returns URL firmada para acceder al archivo
   */
  async getFileUrl(fileName: string) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);

      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      });

      return url;
    } catch (error) {
      console.error("Error obteniendo URL del archivo:", error);
      throw error;
    }
  }

  /**
   * Obtener una URL pública de un archivo por su nombre
   * @param fileName Nombre del archivo
   * @returns URL pública para acceder al archivo
   */
  async getPublicUrl(fileName: string) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);

      // Genera una URL firmada válida por 1 hora
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hora
      });

      return url;
    } catch (error) {
      console.error("Error obteniendo URL pública:", error);
      throw error;
    }
  }
}
