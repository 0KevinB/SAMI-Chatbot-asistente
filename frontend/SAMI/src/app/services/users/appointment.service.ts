import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../../interfaces/appointment.interface';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = '/api/citas';

  constructor(private http: HttpClient) {}

  getAppointments(filters?: {
    pacienteCedula?: string;
    medicoCedula?: string;
    estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    especialidad?: string;
    fecha?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<Appointment[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.append(key, value);
        }
      });
    }

    return this.http.get<Appointment[]>(this.apiUrl, { params });
  }
}