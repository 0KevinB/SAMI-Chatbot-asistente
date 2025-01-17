import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { PacienteService } from './../../services/users/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-vista-paciente',
  imports: [CommonModule, SlidebarComponent, HttpClientModule],
  templateUrl: './vista-paciente.component.html',
  styleUrl: './vista-paciente.component.css',
  standalone: true,
  providers: [HttpClient, PacienteService],
})
export class VistaPacienteComponent implements OnInit {
  paciente: Patient | null = null;
  consultationRecords: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    const pacienteId = this.route.snapshot.paramMap.get('id');
    if (pacienteId) {
      this.loadPacienteData(pacienteId);
    }
  }

  loadPacienteData(id: string): void {
    this.pacienteService.getPacienteById(id).subscribe(
      (data) => {
        if (data) {
          this.paciente = data;
          this.consultationRecords = data.historiasClinicas || [];
        }
      },
      (error) => {
        console.error('Error al cargar los datos del paciente:', error);
      }
    );
  }

  verHistoria(pdfUrl: string): void {
    // Aquí puedes implementar la lógica para mostrar el PDF
    // Por ejemplo, abrir en una nueva pestaña:
    window.open(pdfUrl, '_blank');
  }
}

