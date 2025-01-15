import { db, storage } from "@/config/firebase";
import { HistoriaClinica } from "@/types";
import { v4 as uuidv4 } from "uuid";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

export class HistoriaClinicaService {
  /**
   * Crear una nueva historia clínica
   * @param pacienteCedula Cédula del paciente
   * @param medicoCedula Cédula del médico
   * @param descripcion Descripción de la historia clínica
   * @param pdfFile Archivo PDF de la historia clínica (opcional)
   * @param fecha Fecha opcional de la historia clínica
   * @returns Historia clínica creada
   */
  static async crear(
    pacienteCedula: string,
    medicoCedula: string,
    descripcion: string,
    pdfFile?: Express.Multer.File,
    fecha?: Date
  ): Promise<HistoriaClinica> {
    const id = uuidv4();
    const fechaCreacion = fecha || new Date(); // Usa la fecha proporcionada o la actual

    let pdfUrl = ""; // Valor por defecto vacío para pdfUrl

    // Si se proporciona un archivo PDF, lo subimos a Firebase Storage
    if (pdfFile && pdfFile.mimetype === "application/pdf") {
      const fileName = `historias_clinicas/${id}.pdf`;
      const file = storage.bucket().file(fileName);

      await file.save(pdfFile.buffer, {
        metadata: { contentType: "application/pdf" },
      });

      // Obtener la URL firmada del archivo
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      pdfUrl = url; // Asignar la URL si el PDF se subió
    }

    // Crear el objeto de la historia clínica
    const historiaClinica: HistoriaClinica = {
      id,
      pacienteCedula,
      medicoCedula,
      fecha: fechaCreacion,
      pdfUrl, // Será undefined si no se subió ningún PDF
      descripcion,
    };

    // Guardar los metadatos en Firestore
    await db.collection("historias_clinicas").doc(id).set(historiaClinica);

    // Relacionar la historia clínica con el paciente
    const pacienteSnapshot = await db
      .collection("users")
      .where("cedula", "==", pacienteCedula)
      .limit(1)
      .get();

    if (pacienteSnapshot.empty) {
      throw new Error("Paciente no encontrado");
    }

    const pacienteRef = pacienteSnapshot.docs[0].ref;

    // Actualizar el campo 'historiasClinicas' usando arrayUnion para evitar duplicados
    await pacienteRef.update({
      historiasClinicas: FieldValue.arrayUnion({ id: historiaClinica.id }),
    });

    return historiaClinica;
  }

  /**
   * Obtener historia clinica por su ID
   * @param id Identificador de la historia clinica
   * @returns Historia clinica encontrada o null
   */
  static async obtenerPorId(id: string): Promise<HistoriaClinica | null> {
    const doc = await db.collection("historias_clinicas").doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data() as HistoriaClinica & { fecha: Timestamp };

    // Convert Firestore Timestamp to ISO string
    const fecha = data.fecha.toDate();

    return {
      ...data,
      fecha: fecha,
    };
  }
}
