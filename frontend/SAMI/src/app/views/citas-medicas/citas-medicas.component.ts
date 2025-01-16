import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDays, differenceInDays, endOfMonth, format, startOfMonth, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment } from '../../interfaces/appointment.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { AppointmentService } from '../../services/users/appointment.service';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [SlidebarComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css',
  providers: [AppointmentService, HttpClient]
})
export class CitasMedicasComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  weekDays: Date[] = [];
  appointments: Appointment[] = [];
  searchTerm = '';
  isLoading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private appointmentService: AppointmentService) {
    // Configurar el observable para la búsqueda
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadAppointments();
      });
  }

  ngOnInit() {
    this.initializeMonthDays();
  this.loadAppointments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMonthDays() {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);
    const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
    this.weekDays = Array.from({ length: daysInMonth }, (_, i) => addDays(monthStart, i));
  }
  
  getWeeks(): Date[][] {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
  
    this.weekDays.forEach((day) => {
      currentWeek.push(day);
  
      if (currentWeek.length === 7 || day === this.weekDays[this.weekDays.length - 1]) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  
    return weeks;
  }
  

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private loadAppointments() {
    this.isLoading = true;
    this.error = null;
  
    const fechaInicio = format(this.weekDays[0], 'yyyy-MM-dd');
    const fechaFin = format(this.weekDays[this.weekDays.length - 1], 'yyyy-MM-dd');
  
    console.log('Fetching appointments for date range:', { fechaInicio, fechaFin }); // Debug
  
    const filters = {
      fechaInicio,
      fechaFin,
      ...(this.searchTerm && { pacienteCedula: this.searchTerm }),
    };
  
    this.appointmentService.getAppointments(filters)
      .pipe(
        takeUntil(this.destroy$),
        tap((appointments: any) => {
          console.log('Received appointments:', appointments); // Debug
        })
      )
      .subscribe({
        next: (appointments) => {
          console.log('Processing appointments:', appointments); // Debug
          this.appointments = this.processAppointments(appointments);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.error = 'No se pudieron cargar las citas. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
  }

  private processAppointments(appointments: Appointment[]): Appointment[] {
    if (!Array.isArray(appointments)) {
      console.error('Expected array of appointments, got:', appointments);
      return [];
    }
  
    return appointments.map(appointment => {
      try {
        return {
          ...appointment,
          fecha: appointment.fecha instanceof Date ? appointment.fecha : new Date(appointment.fecha),
          time: appointment.horaInicio,
          eventName: appointment.eventName || `Consulta ${appointment.especialidad}`,
          color: appointment.color || this.getAppointmentColor(appointment.estado)
        };
      } catch (error) {
        console.error('Error processing appointment:', appointment, error);
        return null;
      }
    }).filter(appointment => appointment !== null) as Appointment[];
  }

  private getAppointmentColor(estado: string): string {
    const colors: { [key: string]: string } = {
      'pendiente': 'text-yellow-500',
      'confirmada': 'text-green-500',
      'cancelada': 'text-red-500',
      'completada': 'text-blue-500'
    };
    return colors[estado] || 'text-gray-500';
  }

  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr, { locale: es });
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.appointments.filter(appointment => {
      // Asegurarnos de que la fecha de la cita es una instancia de Date
      const appointmentDate = appointment.fecha instanceof Date 
        ? appointment.fecha 
        : new Date(appointment.fecha);
      
      return format(appointmentDate, 'yyyy-MM-dd') === dateStr;
    });
  }
}