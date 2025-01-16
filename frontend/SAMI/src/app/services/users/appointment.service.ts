import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Appointment } from '../../interfaces/appointment.interface';

interface RawAppointment {
  id: string;
  pacienteCedula: string;
  medicoCedula: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  motivoConsulta?: string;
  especialidad: string;
  motivoEstado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/citas';
  private cache$: Observable<Appointment[]> | null = null;

  constructor(private http: HttpClient) {}

  getAppointments(filters?: {
    pacienteCedula?: string;
    medicoCedula?: string;
    estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    especialidad?: string;
    fecha?: string;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    pageSize?: number;
  }): Observable<Appointment[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    // Si no hay filtros y tenemos caché, retornamos el caché
    if (Object.keys(filters || {}).length === 0 && this.cache$) {
      return this.cache$;
    }

    const request$ = this.http.get(this.apiUrl, { 
      params,
      responseType: 'text' // Primero obtenemos como texto para debug
    }).pipe(
      tap((rawResponse: any) => {
        console.log('Raw API Response:', rawResponse); // Debug
      }),
      map(rawResponse => {
        try {
          const parsedResponse = JSON.parse(rawResponse);
          console.log('Parsed Response:', parsedResponse); // Debug
          return parsedResponse;
        } catch (error) {
          console.error('Error parsing response:', error);
          throw new Error('Invalid JSON response from server');
        }
      }),
      map((appointments: RawAppointment[]) => this.transformAppointments(appointments)),
      tap(transformedAppointments => {
        console.log('Transformed Appointments:', transformedAppointments); // Debug
      }),
      catchError(this.handleError),
      shareReplay(1)
    );

    // Cachear el resultado si no hay filtros
    if (Object.keys(filters || {}).length === 0) {
      this.cache$ = request$;
    }

    return request$;
  }

  private transformAppointments(rawAppointments: RawAppointment[]): Appointment[] {
    if (!Array.isArray(rawAppointments)) {
      console.error('Expected array of appointments, got:', rawAppointments);
      return [];
    }

    return rawAppointments.map(raw => {
      try {
        return {
          ...raw,
          fecha: new Date(raw.fecha),
          eventName: `Consulta ${raw.especialidad}`,
          color: this.getAppointmentColor(raw.estado)
        };
      } catch (error) {
        console.error('Error transforming appointment:', raw, error);
        return null;
      }
    }).filter(appointment => appointment !== null) as Appointment[];
  }

  private getAppointmentColor(estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'): string {
    const colors = {
      'pendiente': 'text-yellow-500',
      'confirmada': 'text-green-500',
      'cancelada': 'text-red-500',
      'completada': 'text-blue-500'
    };
    return colors[estado] || 'text-gray-500';
  }

  private handleError(error: HttpErrorResponse | Error) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error instanceof HttpErrorResponse) {
      console.error('Full HTTP Error:', error);
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
        if (error.error) {
          console.log('Server error body:', error.error);
        }
      }
    } else {
      errorMessage = error.message;
    }
    
    console.error('Processed error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  clearCache() {
    this.cache$ = null;
  }
}