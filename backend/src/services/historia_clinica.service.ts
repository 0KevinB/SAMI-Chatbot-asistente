import { db, storage } from "../config/firebase";
import { HistoriaClinica } from "../types";
import { v4 as uuidv4 } from "uuid";

export class HistoriaClinicaService {
  static async crear(
    pacienteCedula: string,
    medicoCedula: string,
    descripcion: string,
    pdfFile: Express.Multer.File,
    fecha?: Date
  ): Promise<HistoriaClinica> {
    const id = uuidv4();
    const fechaCreacion = fecha || new Date(); // Usa la fecha proporcionada o la actual

    // Validar el archivo PDF
    if (!pdfFile || pdfFile.mimetype !== "application/pdf") {
      throw new Error("Se requiere un archivo PDF válido");
    }

    // Subir el archivo PDF a Firebase Storage
    const fileName = `historias_clinicas/${id}.pdf`;
    const file = storage.bucket().file(fileName);
    await file.save(pdfFile.buffer, {
      metadata: {
        contentType: "application/pdf",
      },
    });

    // Obtener la URL del archivo
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Fecha lejana en el futuro
    });

    const historiaClinica: HistoriaClinica = {
      id,
      pacienteCedula,
      medicoCedula,
      fecha: fechaCreacion,
      pdfUrl: url,
      descripcion,
    };

    // Guardar los metadatos en Firestore
    await db.collection("historias_clinicas").doc(id).set(historiaClinica);

    return historiaClinica;
  }

  static async obtenerPorId(id: string): Promise<HistoriaClinica | null> {
    const doc = await db.collection("historias_clinicas").doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as HistoriaClinica;
  }

  // Puedes agregar más métodos según sea necesario, como listar, actualizar, eliminar, etc.
}
