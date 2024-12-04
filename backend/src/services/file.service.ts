import * as admin from 'firebase-admin';

export class FileService {
  async listFiles(prefix?: string) {
    try {
      // Obtener el bucket por defecto
      const bucket = admin.storage().bucket();
      
      // Usa un valor por defecto si prefix es undefined
      const filesPrefix = prefix || '';
      
      const [files] = await bucket.getFiles({ prefix: filesPrefix });
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        updated: file.metadata.updated
      }));
    } catch (error) {
      console.error('Error en el servicio de archivos:', error);
      throw error;
    }
  }

  async getFileUrl(fileName: string) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);
      
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      });

      return url;
    } catch (error) {
      console.error('Error obteniendo URL del archivo:', error);
      throw error;
    }
  }


  async getPublicUrl(fileName: string) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);
      
      // Genera una URL firmada válida por 1 hora
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hora
      });

      return url;
    } catch (error) {
      console.error('Error obteniendo URL pública:', error);
      throw error;
    }
  }
}
