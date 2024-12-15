import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { pacientes } from '../../mocks/pacientes.mock';
import { FormsModule } from '@angular/forms';

interface Paciente {
  nombres: string;
  apellidos: string;
  identificacion: string;
  contacto: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
}

@Component({
  selector: 'app-dashboard-principal',
  imports: [SlidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './dashboard-principal.component.html',
  styleUrl: './dashboard-principal.component.css',
  standalone: true,
})
export class DashboardPrincipalComponent {
  listaPacientes = pacientes;
  mostrarFormulario = false;
  nuevoPaciente: Paciente = {
    nombres: '',
    apellidos: '',
    identificacion: '',
    contacto: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
  };

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardarPaciente() {
    // Añadir el nuevo paciente a la lista
    this.listaPacientes.push({
      ...this.nuevoPaciente,
      cedula: '',
      telefono: '',
      fechaEvaluacion: '',
    });

    // Resetear el formulario
    this.nuevoPaciente = {
      nombres: '',
      apellidos: '',
      identificacion: '',
      contacto: '',
      fechaNacimiento: '',
      lugarNacimiento: '',
    };

    // Ocultar el formulario
    this.mostrarFormulario = false;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    // Resetear el formulario
    this.nuevoPaciente = {
      nombres: '',
      apellidos: '',
      identificacion: '',
      contacto: '',
      fechaNacimiento: '',
      lugarNacimiento: '',
    };
  }
}
