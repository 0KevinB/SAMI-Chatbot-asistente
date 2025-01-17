import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { PacienteService } from './../../services/users/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../interfaces/patient.interface';
import { MedicService } from '../../services/medico.service';
import { Medic } from '../../interfaces/medic.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';

interface DoctorInfo {
  [cedula: string]: Observable<string>;
}

@Component({
  selector: 'app-vista-paciente',
  imports: [CommonModule, SlidebarComponent, HttpClientModule],
  templateUrl: './vista-paciente.component.html',
  styleUrl: './vista-paciente.component.css',
  standalone: true,
  providers: [HttpClient, PacienteService, MedicService],
})
export class VistaPacienteComponent implements OnInit, AfterViewInit {
  paciente: Patient | null = null;
  consultationRecords: any[] = [];
  doctorInfo: DoctorInfo = {};
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private medicoService: MedicService
  ) {}

  ngOnInit(): void {
    const pacienteId = this.route.snapshot.paramMap.get('id');
    if (pacienteId) {
      this.loadPacienteData(pacienteId);
    }
  }

  ngAfterViewInit(): void {
    // El gráfico se renderiza después de que se cargan los datos del paciente.
    if (this.paciente) {
      this.renderGlucoseChart();
    }
  }

  loadPacienteData(id: string): void {
    this.pacienteService.getPacienteById(id).subscribe(
      (data) => {
        if (data) {
          this.paciente = data;
          this.consultationRecords = data.historiasClinicas || [];
          this.loadDoctorInfo();
          this.renderGlucoseChart();
          console.log('Datos del paciente:', this.paciente);
        }
      },
      (error) => {
        console.error('Error al cargar los datos del paciente:', error);
        this.error = 'Error al cargar los datos del paciente';
      }
    );
  }

  loadDoctorInfo() {
    const uniqueCedulas = [
      ...new Set(this.consultationRecords.map((record) => record.medicoCedula)),
    ];

    uniqueCedulas.forEach((cedula) => {
      this.doctorInfo[cedula] = this.medicoService
        .getMedicByCedula(cedula)
        .pipe(
          map((medic) => `${medic.nombre} ${medic.apellido}`),
          catchError(() => of('N/A'))
        );
    });
  }

  getDoctorName(cedula: string): Observable<string> {
    return this.doctorInfo[cedula] || of('N/A');
  }

  renderGlucoseChart(): void {
    if (
      !this.paciente?.nivelesGlucosa ||
      this.paciente.nivelesGlucosa.length === 0
    ) {
      console.warn('No hay datos de glucosa para mostrar.');
      return;
    }

    const fechas = this.paciente.nivelesGlucosa.map((nivel) => nivel.fecha);
    const niveles = this.paciente.nivelesGlucosa.map((nivel) => nivel.valor);
    const min = this.paciente.rangoGlucosa?.min || 0;
    const max = this.paciente.rangoGlucosa?.max || 0;
    const objetivo = this.paciente.rangoGlucosa?.objetivo || 0;

    const canvas = document.getElementById('glucoseChart') as HTMLCanvasElement;

    if (canvas) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: fechas,
          datasets: [
            {
              label: 'Nivel de Glucosa',
              data: niveles,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Objetivo',
              data: Array(fechas.length).fill(objetivo),
              borderColor: 'green',
              borderDash: [5, 5],
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Niveles de Glucosa',
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} mg/dL`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: min - 20,
              suggestedMax: max + 20,
              title: {
                display: true,
                text: 'Nivel de Glucosa (mg/dL)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Fecha',
              },
            },
          },
        },
      });
    }
  }

  verHistoria(pdfUrl: string): void {
    window.open(pdfUrl, '_blank');
  }
}
