// patient.interface.ts
export interface Patient {
  id: string;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  role: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  edad?: number;
  peso?: number;
  altura?: number;
  genero?: string;
  rangoGlucosa?: {
    min: number;
    max: number;
    objetivo: number;
  };
  contactoEmergencia?: {
    nombre: string;
    telefono: string;
    relacion: string;
  };
  nivelesGlucosa?: Array<{
    valor: number;
    fecha: string;
    notas?: string;
    contexto?: string;
    unidad: string;
  }>;
  medicamentos?: Array<{
    nombre: string;
    dosis: string;
    frecuencia: string;
    fechaInicio: string;
    fechaFin?: string | null;
    indicaciones?: string;
  }>;
  historiasClinicas?: Array<{
    id: string;
    pacienteCedula: string;
    medicoCedula: string;
    fecha: string;
    pdfUrl: string;
    descripcion: string;
  }>;
  recetas?: Array<{
    id: string;
    pacienteCedula: string;
    medicoCedula: string;
    fecha: string;
    pdfUrl: string;
    medicamentos: Array<{
      nombre: string;
      dosis: string;
      frecuencia: string;
      fechaInicio: string;
      indicaciones: string;
    }>;
  }>;
  fechaNacimiento?: string;
  apellido?: string;
}
