import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService {
  constructor(private http: HttpClient) {}

  async procesarPDF(pdfData: any): Promise<any> {
    try {
      // Extraer el texto del PDF usando el evento textLayerRendered de ng2-pdf-viewer
      const texto = pdfData.text;
      return this.extraerInformacion(texto);
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      throw new Error('Error al procesar el PDF');
    }
  }

  private extraerInformacion(texto: string): any {
    const extraerCampo = (patron: RegExp): string => {
      const coincidencia = texto.match(patron);
      return coincidencia ? coincidencia[1].trim() : '';
    };

    return {
      establecimientoSalud: extraerCampo(
        /ESTABLECIMIENTO DE SALUD[:\s]+([^\n]+)/i
      ),
      nombre: extraerCampo(/NOMBRE[:\s]+([^\n]+)/i),
      apellidos: extraerCampo(/APELLIDOS?[:\s]+([^\n]+)/i),
      sexo: extraerCampo(/SEXO[:\s]+([^\n]+)/i),
      edad: extraerCampo(/EDAD[:\s]+([^\n]+)/i),
      numeroHistoriaClinica: extraerCampo(/N° HISTORIA CLÍNICA[:\s]+([^\n]+)/i),
      antecedentesPersonales: extraerCampo(
        /ANTECEDENTES PERSONALES[:\s]+([^\n]+)/i
      ),
      antecedentesQuirurgicos: extraerCampo(
        /ANTECEDENTES QUIRÚRGICOS[:\s]+([^\n]+)/i
      ),
      alergias: extraerCampo(/ALERGIAS[:\s]+([^\n]+)/i),
      habitos: extraerCampo(/HÁBITOS[:\s]+([^\n]+)/i),
      tratamientosEspeciales: extraerCampo(
        /TRATAMIENTOS ESPECIALES[:\s]+([^\n]+)/i
      ),
      antecedentesGinecologicos: extraerCampo(
        /ANTECEDENTES GINECOLÓGICOS \/ OBSTÉTRICOS[:\s]+([^\n]+)/i
      ),
      antecedentesFamiliares: extraerCampo(
        /ANTECEDENTES FAMILIARES[:\s]+([^\n]+)/i
      ),
      signosVitales: {
        fecha: extraerCampo(/FECHA[:\s]+([^\n]+)/i),
        profesional: extraerCampo(/PROFESIONAL[:\s]+([^\n]+)/i),
        especialidad: extraerCampo(/ESPECIALIDAD[:\s]+([^\n]+)/i),
        temperatura: extraerCampo(/TEMPERATURA[:\s]+([^\n]+)/i),
        presionArterial: extraerCampo(/PRESIÓN ARTERIAL[:\s]+([^\n]+)/i),
        pulso: extraerCampo(/PULSO \/ FRECUENCIA CARDÍACA[:\s]+([^\n]+)/i),
        frecuenciaRespiratoria: extraerCampo(
          /FRECUENCIA RESPIRATORIA[:\s]+([^\n]+)/i
        ),
        saturacionOxigeno: extraerCampo(/SATURACIÓN DE OXÍGENO[:\s]+([^\n]+)/i),
        talla: extraerCampo(/TALLA $$CM$$[:\s]+([^\n]+)/i),
        peso: extraerCampo(/PESO $$KG$$[:\s]+([^\n]+)/i),
        imc: extraerCampo(/I\.M\.C[:\s]+([^\n]+)/i),
      },
      motivoConsulta: extraerCampo(/MOTIVO DE CONSULTA[:\s]+([^\n]+)/i),
      enfermedadActual: extraerCampo(
        /ENFERMEDAD O PROBLEMA ACTUAL[:\s]+([^\n]+)/i
      ),
      examenFisico: extraerCampo(/EXAMEN FÍSICO[:\s]+([^\n]+)/i),
      diagnosticosPresuntivos: this.extraerDiagnosticos(
        texto,
        'DIAGNÓSTICOS PRESUNTIVOS'
      ),
      diagnosticosDefinitivos: this.extraerDiagnosticos(
        texto,
        'DIAGNÓSTICOS DEFINITIVOS'
      ),
      planesTratamiento: extraerCampo(/PLANES DE TRATAMIENTO[:\s]+([^\n]+)/i),
      evolucion: extraerCampo(/EVOLUCIÓN[:\s]+([^\n]+)/i),
      prescripciones: this.extraerPrescripciones(texto),
      observaciones: extraerCampo(
        /OBSERVACIONES Y\/O RECOMENDACIONES ADICIONALES[:\s]+([^\n]+)/i
      ),
    };
  }

  private extraerDiagnosticos(texto: string, tipo: string): any[] {
    const seccion = new RegExp(
      `${tipo}[:\\s]+([\\s\\S]+?)(?=\\n\\s*[A-ZÁÉÍÓÚÑ]|$)`,
      'i'
    );
    const coincidencia = texto.match(seccion);
    if (!coincidencia) return [];

    const diagnosticos = coincidencia[1]
      .split('\n')
      .filter((linea) => linea.trim());
    return diagnosticos.map((diagnostico) => {
      const [codigo, ...descripcion] = diagnostico.split('(');
      return {
        codigo: codigo.trim(),
        descripcion: descripcion.join('(').replace(')', '').trim(),
      };
    });
  }

  private extraerPrescripciones(texto: string): any[] {
    const seccionPrescripciones = texto.match(
      /PRESCRIPCIONES[\s\S]+?(?=\n\s*[A-ZÁÉÍÓÚÑ]|$)/i
    );
    if (!seccionPrescripciones) return [];

    const lineas = seccionPrescripciones[0]
      .split('\n')
      .filter((linea) => linea.trim());
    const prescripciones = [];

    for (let i = 1; i < lineas.length; i++) {
      const linea = lineas[i];
      const partes = linea.split(/\s{2,}/);
      if (partes.length >= 3) {
        prescripciones.push({
          medicamento: partes[0].trim(),
          cantidad: partes[1].trim(),
          indicaciones: partes[2].trim(),
        });
      }
    }

    return prescripciones;
  }
}
