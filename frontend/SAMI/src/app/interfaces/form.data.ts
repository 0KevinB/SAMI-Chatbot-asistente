export interface HistoriaClinica {
  establecimientoDeSalud: string;
  paciente: {
    nombre: string;
    apellidos: string;
    sexo: 'MASCULINO' | 'FEMENINO';
    edad: string;
    numeroHistoriaClinica: string;
  };
  antecedentes: {
    personales: string;
    quirurgicos: string;
    alergias: string;
    habitos: string;
    tratamientosEspeciales: string;
    ginecologicosObstetricos: string;
    familiares: string;
  };
  indicacionesAdicionales: string;
  signosVitales: {
    fecha: Date;
    profesional: string;
    especialidad: string;
    temperatura: number;
    presionArterial: string;
    pulsoFrecuenciaCardiaca: number;
    frecuenciaRespiratoria: number;
    saturacionOxigeno: number;
    talla: number;
    peso: {
      kg: number;
      lb: number;
    };
    imc: number;
    perimetroCefalico: number;
  };
  motivoConsulta: string;
  enfermedadProblemaActual: string;
  examenFisico: string;
  diagnosticos: {
    presuntivos: Array<{
      descripcion: string;
      codigo: string;
    }>;
    definitivos: Array<{
      descripcion: string;
      codigo: string;
    }>;
  };
  planesTratamiento: string[];
  evolucion: string;
  prescripciones: Array<{
    medicamento: string;
    cantidad: number;
    indicaciones: string;
  }>;
  observacionesRecomendaciones: string;
  atencion: {
    fecha: Date;
    hora: string;
    especialidad: string;
    nombreProfesional: string;
    codigo: string;
  };
}
