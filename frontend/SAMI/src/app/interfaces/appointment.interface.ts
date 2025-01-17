export interface Appointment {
  id: string;
  pacienteCedula: string;
  medicoCedula: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: string;
  especialidad: string;
  notas: string;
  motivoConsulta: string;
  eventName: string;
  color: string;
}
