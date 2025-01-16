export interface Appointment {
eventName: any;
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
  color?: string; // Agregamos esta propiedad para mantener la compatibilidad con tu componente actual
}