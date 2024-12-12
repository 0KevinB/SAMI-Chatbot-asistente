import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { pacientes } from './../../mocks/perfilpaciente.mock';
@Component({
  selector: 'app-vista-paciente',
  imports: [CommonModule, HttpClientModule, SlidebarComponent],
  templateUrl: './vista-paciente.component.html',
  styleUrl: './vista-paciente.component.css',
  standalone: true,
})
export class VistaPacienteComponent {
  listaPacientes = pacientes;
  consultationRecords: any[] = [
    {
      date: '13-Ago-2023, 10:00 AM',
      reason: 'EDEMA DE MIEMBRO INFERIOR IZQUIERDO',
    },
  ];
  patient: any = pacientes[0];
}
