import { Timestamp } from "firebase-admin/firestore";

/**
 * Interfaz base para usuarios del sistema
 * Contiene información básica de identificación y autenticación
 */
export interface User {
  cedula: string; // Identificador único de documento/cédula
  nombre: string; // Nombre completo del usuario
  email: string; // Correo electrónico para inicio de sesión y contacto
  password: string; // Contraseña hasheada para autenticación
  role: "admin" | "medico" | "paciente"; // Rol de usuario para control de acceso
  createdAt?: Timestamp; // Fecha de creación del registro
  updatedAt?: Timestamp; // Fecha de última actualización
}

/**
 * Extiende User con información específica de paciente
 * Incluye registros médicos, medicación e historial clínico
 */
export interface Paciente extends User {
  fechaNacimiento?: string; // Fecha de nacimiento en formato ISO (YYYY-MM-DD)
  peso?: number; // Peso en kilogramos para seguimiento
  altura?: number; // Altura en centímetros
  genero?: "masculino" | "femenino" | "otro"; // Género para consideraciones médicas

  // Rango objetivo de glucosa para monitoreo personalizado
  rangoGlucosa?: {
    min: number; // Valor mínimo de glucosa aceptable
    max: number; // Valor máximo de glucosa aceptable
    objetivo: number; // Valor objetivo de glucosa
  };

  contactoEmergencia?: {
    // Información para contacto en caso de emergencia
    nombre: string;
    telefono: string;
    relacion?: string;
  };

  nivelesGlucosa: GlucosaRecord[]; // Historial de mediciones de glucosa
  medicamentos: Medicamento[]; // Medicamentos actuales o pasados
  historiasClinicas: HistoriaClinica[]; // Registros médicos completos
  recetas: Receta[]; // Recetas médicas emitidas
}

/**
 * Extiende User con información específica de médico
 * Gestiona pacientes, especialidad y disponibilidad
 */
export interface Medico extends User {
  especialidad: string; // Área de especialización médica
  citasMedicas: Cita[]; // Horarios de atención
  pacientes: string[]; // Cédulas de pacientes bajo su cuidado
  contactoConsultorio?: {
    // Información de contacto profesional
    telefono?: string;
    direccion?: string;
  };
}

/**
 * Registro detallado de nivel de glucosa
 * Permite un seguimiento preciso de las mediciones
 */
export interface GlucosaRecord {
  valor: number; // Valor numérico de glucosa
  fecha: Date; // Fecha y hora de la medición
  notas?: string; // Observaciones adicionales
  contexto?: "ayunas" | "post-comida" | "aleatorio"; // Condición de la medición
  unidad?: "mg/dL" | "mmol/L"; // Unidad de medida
}

/**
 * Información detallada de medicamentos
 * Permite un seguimiento completo de la medicación
 */
export interface Medicamento {
  nombre: string; // Nombre del medicamento
  dosis: string; // Cantidad y forma de administración
  frecuencia: string; // Intervalos de toma
  fechaInicio: Date; // Fecha de inicio del tratamiento
  fechaFin?: Date; // Fecha de finalización (opcional)
  indicaciones?: string; // Instrucciones específicas
}

/**
 * Registro de historia clínica
 * Documenta encuentros médicos y diagnósticos
 */
export interface HistoriaClinica {
  id: string; // Identificador único
  pacienteCedula: string; // Referencia al paciente
  medicoCedula: string; // Médico que realizó el registro
  fecha: Date; // Fecha del registro
  pdfUrl: string | ""; // Enlace al documento digitalizado
  descripcion: string; // Resumen del encuentro médico
}

/**
 * Receta médica
 * Documenta prescripciones médicas
 */
export interface Receta {
  id: string; // Identificador único
  pacienteCedula: string; // Paciente destinatario
  medicoCedula: string; // Médico que emite la receta
  fecha: Date; // Fecha de emisión
  pdfUrl: string; // Enlace al documento digitalizado
  medicamentos: Medicamento[]; // Lista de medicamentos recetados
}

/**
 * Citas médicas
 * Gestiona programación y estado de consultas
 */
export interface Cita {
  id: string; // Identificador único
  pacienteCedula: string; // Paciente que solicita
  medicoCedula: string; // Médico asignado
  fecha: Date; // Fecha y hora de la cita
  horaInicio: string; // Hora estimada para el inicio de la cita medica
  horaFin: string; // Hora estimada para la finalización de la cita medica
  estado: "pendiente" | "confirmada" | "cancelada" | "completada"; // Estado actual de la cita medica
  notas?: string; // Observaciones adicionales
  motivoConsulta?: string; // Razón de la consulta
  especialidad: string; // Especialidad del medico
  motivoEstado?: string; // Campo del motivo del cambio de estado
}
