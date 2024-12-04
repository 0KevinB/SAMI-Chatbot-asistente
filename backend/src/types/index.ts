import { Timestamp } from "firebase-admin/firestore";

export interface User {
  cedula: string;
  nombre: string;
  email: string;
  password: string;
  role: 'admin' | 'medico' | 'paciente';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Paciente extends User {
  nivelesGlucosa: GlucosaRecord[];
  medicamentos: Medicamento[];
  historiasClinicas: HistoriaClinica[];
  recetas: Receta[];
}

export interface Medico extends User {
  especialidad: string;
  horarioDisponible: Horario[];
  pacientes: string[]; // cédulas de pacientes
}

export interface GlucosaRecord {
  valor: number;
  fecha: Date;
  notas?: string;
}

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface HistoriaClinica {
  id: string;
  pacienteCedula: string;
  medicoCedula: string;
  fecha: Date;
  pdfUrl: string;
  descripcion: string;
}

export interface Receta {
  id: string;
  pacienteCedula: string;
  medicoCedula: string;
  fecha: Date;
  pdfUrl: string;
  medicamentos: Medicamento[];
}

export interface Horario {
  dia: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface Cita {
  id: string;
  pacienteCedula: string;
  medicoCedula: string;
  fecha: Date;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
}