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
   * Listar recetas filtrando por la cédula del paciente
   * @param pacienteCedula Cédula del paciente
   * @returns Lista de recetas filtradas
   */
  static async listarPorPacienteCedula(
    pacienteCedula: string
  ): Promise<Receta[]> {
    try {
      // Obtener todos los documentos de la colección "recetas"
      const snapshot = await db.collection("recetas").get();

      // Filtrar manualmente por el campo 'pacienteCedula'
      const recetas: Receta[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.pacienteCedula === pacienteCedula) {
          recetas.push({
            id: doc.id,
            pacienteCedula: data.pacienteCedula,
            medicoCedula: data.medicoCedula,
            fecha: data.fecha.toDate(), // Convertir a Date si es un Timestamp
            pdfUrl: data.pdfUrl,
            medicamentos: data.medicamentos || [],
          });
        }
      });

      return recetas;
    } catch (error) {
      console.error("Error al listar las recetas:", error);
      throw new Error("No se pudieron obtener las recetas");
    }
  }
}
