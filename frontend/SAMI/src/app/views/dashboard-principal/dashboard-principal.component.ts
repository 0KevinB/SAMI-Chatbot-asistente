import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../interfaces/patient.interface';
import { PacienteService } from '../../services/users/paciente.service';
import { catchError, Observable, of } from 'rxjs';

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
  providers: [PacienteService],
})
export class DashboardPrincipalComponent {
  listaPacientes: (Patient & { ultimaHistoriaClinica?: any })[] = [];

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (pacientes) => {
        this.listaPacientes = pacientes;
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
      },
    });
  }
  getUltimaFechaEvaluacion(
    paciente: Patient & { ultimaHistoriaClinica?: any }
  ): string {
    if (paciente.ultimaHistoriaClinica) {
      const date = new Date(paciente.ultimaHistoriaClinica.fecha);
      // Ajustar la fecha a UTC -5
      const offset = -5; // UTC -5
      date.setHours(date.getHours() + offset);

      const formattedDate = date.toISOString().slice(0, 16).replace('T', ' '); // Formato: yyyy-mm-dd hh:mm
      return formattedDate;
    }
    return 'N/A';
  }
  mostrarFormulario = false;
  nuevoPaciente = {
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    role: 'paciente',
  };

  formIsValid(): boolean {
    return (
      !!this.nuevoPaciente.nombre &&
      !!this.nuevoPaciente.cedula &&
      !!this.nuevoPaciente.telefono &&
      !!this.nuevoPaciente.email &&
      !!this.nuevoPaciente.password
    );
  }
  mensaje: { texto: string; tipo: string } | null = null;

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardarPaciente() {
    this.pacienteService.registerPatient(this.nuevoPaciente).subscribe({
      next: (response) => {
        this.mensaje = {
          texto: 'Paciente registrado exitosamente',
          tipo: 'success-message',
        };
        this.mostrarFormulario = false;
        // Aquí puedes agregar lógica adicional, como actualizar la lista de pacientes
      },
      error: (error) => {
        this.mensaje = {
          texto: 'Error al registrar paciente: ' + error.error.message,
          tipo: 'error-message',
        };
      },
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  deletePatient(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      this.pacienteService.deletePatient(id).subscribe({
        next: () => {
          this.listaPacientes = this.listaPacientes.filter(
            (patient) => patient.id !== id
          );
          alert('Paciente eliminado con éxito');
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          alert('Error al eliminar el paciente');
        },
      });
    }
  }
}
