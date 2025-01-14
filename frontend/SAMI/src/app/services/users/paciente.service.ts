// paciente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Patient } from '../../interfaces/patient.interface';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`).pipe(
      switchMap((patients) => {
        const patientsWithLastHistoria = patients.map((patient) =>
          this.getUltimaHistoriaClinica(patient).pipe(
            map((ultimaHistoria) => ({
              ...patient,
              ultimaHistoriaClinica: ultimaHistoria,
            }))
          )
        );
        return forkJoin(patientsWithLastHistoria);
      })
    );
  }

  getUltimaHistoriaClinica(paciente: Patient): Observable<any> {
    if (
      paciente.historiasClinicas &&
      paciente.historiasClinicas.length > 0 &&
      paciente.historiasClinicas[paciente.historiasClinicas.length - 1].id
    ) {
      const ultimaHistoria =
        paciente.historiasClinicas[paciente.historiasClinicas.length - 1];
      return this.http
        .get<any>(`${this.apiUrl}/historias-clinicas/${ultimaHistoria.id}`)
        .pipe(
          catchError((error) => {
            console.error('Error fetching ultima historia clinica:', error);
            return of(null);
          })
        );
    }
    return of(null);
  }
  registerPatient(patientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, patientData);
  }

  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patients/${id}`);
  }
}
