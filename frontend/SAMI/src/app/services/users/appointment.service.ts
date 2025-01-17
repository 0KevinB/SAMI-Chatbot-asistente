import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Appointment } from '../../interfaces/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private apiUrl = 'http://localhost:3000/api/citas';

  constructor(private http: HttpClient) {}

  getCitas(medicoCedula: string, filters?: any): Observable<Appointment[]> {
    let params = new HttpParams().set('medicoCedula', medicoCedula);
    if (filters) {
      Object.keys(filters).forEach((key) => {
        params = params.append(key, filters[key]);
      });
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response && response.citas) {
          return response.citas.map((cita: any) =>
            this.mapCitaToAppointment(cita)
          );
        }
        return [];
      })
    );
  }

  actualizarCita(
    id: string,
    nuevoEstado: string,
    motivoEstado: string
  ): Observable<any> {
    const url = `${this.apiUrl}/actualizar/${id}`;
    console.log(url);
    console.log(motivoEstado);
    return this.http.put(url, {
      estado: nuevoEstado,
      motivoEstado: motivoEstado,
    });
  }

  private mapCitaToAppointment(cita: any): Appointment {
    return {
      id: cita.id,
      pacienteCedula: cita.pacienteCedula,
      medicoCedula: cita.medicoCedula,
      fecha: new Date(cita.fecha),
      horaInicio: cita.horaInicio,
      horaFin: cita.horaFin,
      estado: cita.estado,
      especialidad: cita.especialidad,
      notas: cita.notas,
      motivoConsulta: cita.motivoConsulta,
      eventName: `${cita.especialidad} - ${cita.motivoConsulta}`,
      color: this.getAppointmentColor(cita.estado),
    };
  }

  getAppointmentColor(estado: string): string {
    const colors: { [key: string]: string } = {
      pendiente: 'text-yellow-500',
      confirmada: 'text-green-500',
      cancelada: 'text-red-500',
      completada: 'text-blue-500',
      aceptada: 'text-blue-500',
    };
    return colors[estado] || 'text-gray-500';
  }
}
