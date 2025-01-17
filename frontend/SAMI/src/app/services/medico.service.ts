import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medic } from '../interfaces/medic.interface';

@Injectable({
  providedIn: 'root',
})
export class MedicService {
  private apiUrl = 'http://localhost:3000/api/medics';

  constructor(private http: HttpClient) {}

  getMedicByCedula(cedula: string): Observable<Medic> {
    return this.http.get<Medic>(`${this.apiUrl}/${cedula}`);
  }
}
