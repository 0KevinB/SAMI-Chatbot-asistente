import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { pacientes } from './perfilpaciente.mock';


@Component({
  selector: 'app-historial-clinico-paciente',
  imports: [CommonModule, HttpClientModule, SlidebarComponent],
  templateUrl: './historial-clinico-paciente.component.html',
  styleUrl: './historial-clinico-paciente.component.css',
  standalone: true
})
export class HistorialClinicoPacienteComponent {
  listaPacientes = pacientes;
}
