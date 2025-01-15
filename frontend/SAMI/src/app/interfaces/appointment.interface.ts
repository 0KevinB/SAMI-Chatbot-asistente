export interface Appointment {
    id: string;
    pacienteCedula: string;
    medicoCedula: string;
    fecha: Date;
    horaInicio: string;
    horaFin: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    notas?: string;
    motivoConsulta?: string;
    especialidad: string;
    motivoEstado?: string;
  }