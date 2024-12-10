import { db, storage } from "@/config/firebase";
import { Receta } from "@/types";
import { v4 as uuidv4 } from "uuid";

export class RecetaService {
  /**
   * Crear una nueva receta médica con archivo PDF
   * @param pacienteCedula Cédula del paciente
   * @param medicoCedula Cédula del médico
   * @param medicamentos Lista de medicamentos recetados
   * @param pdfFile Archivo PDF de la receta
   * @param fecha Fecha opcional de la receta
   * @returns Receta creada
   */
  static async crear(
    pacienteCedula: string,
    medicoCedula: string,
    medicamentos: any[], // Usar el tipo Medicamento de tus tipos
    pdfFile: Express.Multer.File,
    fecha?: Date
  ): Promise<Receta> {
    const id = uuidv4();
    const fechaCreacion = fecha || new Date();

    // Validar el archivo PDF
    if (!pdfFile || pdfFile.mimetype !== "application/pdf") {
      throw new Error("Se requiere un archivo PDF válido");
    }

    // Subir el archivo PDF a Firebase Storage
    const fileName = `recetas/${id}.pdf`;
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

    const receta: Receta = {
      id,
      pacienteCedula,
      medicoCedula,
      fecha: fechaCreacion,
      pdfUrl: url,
      medicamentos,
    };

    // Guardar los metadatos en Firestore
    await db.collection("recetas").doc(id).set(receta);

    return receta;
  }

  /**
   * Obtener receta por su ID
   * @param id Identificador de la receta
   * @returns Receta encontrada o null
   */
  static async obtenerPorId(id: string): Promise<Receta | null> {
    const doc = await db.collection("recetas").doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Receta;
  }

  /**
   * Listar recetas de un paciente
   * @param pacienteCedula Cédula del paciente
   * @returns Lista de recetas
   */
  static async listarPorPaciente(pacienteCedula: string): Promise<Receta[]> {
    const snapshot = await db
      .collection("recetas")
      .where("pacienteCedula", "==", pacienteCedula)
      .orderBy("fecha", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data() as Receta);
  }
}
