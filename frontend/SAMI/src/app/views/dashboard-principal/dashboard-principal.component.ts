import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { pacientes } from '../../mocks/pacientes.mock';
import { FormsModule } from '@angular/forms';

interface Paciente {
  nombre: string;
  apellido: string;
  cedula: string;
  contacto: string;
  email: string;
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
    nombre: '',
    apellido: '',
    cedula: '',
    contacto: '',
    email: '',
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
      contacto: '',
      fechaEvaluacion: '',
    });

    // Resetear el formulario
    this.nuevoPaciente = {
      nombre: '', // Cambia 'nombres' a 'nombre'
      apellido: '', // Cambia 'apellidos' a 'apellido'
      cedula: '', // Cambia 'identificacion' a 'cedula'
      fechaNacimiento: '',
      email: '', 
      contacto: '',
      lugarNacimiento: ''
    }

    // Ocultar el formulario
    this.mostrarFormulario = false;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    // Resetear el formulario
    this.nuevoPaciente = {
      nombre: '',
      apellido: '',
      cedula: '',
      contacto: '',
      email: '', 
      fechaNacimiento: '',
      lugarNacimiento: '',
    };
  }
}
