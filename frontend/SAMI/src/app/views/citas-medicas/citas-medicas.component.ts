// citas-medicas.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CitasService } from '../../services/users/appointment.service';
import { AuthService } from '../../services/users/auth.service';
import { Appointment } from '../../interfaces/appointment.interface';
import {
  addDays,
  differenceInDays,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [SlidebarComponent, CommonModule, HttpClientModule, FormsModule],
  providers: [AuthService, CitasService],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css',
})
export class CitasMedicasComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  weekDays: Date[] = [];
  appointments: Appointment[] = [];
  searchTerm = '';
  isLoading = false;
  error: string | null = null;
  medicoCedula: string;
  selectedAppointment: Appointment | null = null;
  currentFilter: string = 'todos';

  statusFilters = [
    { label: 'Todos', value: 'todos', class: 'filter-btn-all' },
    { label: 'Pendientes', value: 'pendiente', class: 'filter-btn-pending' },
    {
      label: 'Confirmadas',
      value: 'confirmada',
      class: 'filter-btn-confirmed',
    },
    { label: 'Canceladas', value: 'cancelada', class: 'filter-btn-cancelled' },
    {
      label: 'Completadas',
      value: 'completada',
      class: 'filter-btn-completed',
    },
  ];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private citasService: CitasService,
    private authService: AuthService
  ) {
    this.medicoCedula = '1234567890';
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAppointments();
      });
  }

  ngOnInit() {
    this.initializeMonthDays();
    this.loadAppointments();
    console.log(this.appointments);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMonthDays() {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);
    const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
    this.weekDays = Array.from({ length: daysInMonth }, (_, i) =>
      addDays(monthStart, i)
    );
  }

  getWeeks(): Date[][] {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    this.weekDays.forEach((day) => {
      currentWeek.push(day);

      if (
        currentWeek.length === 7 ||
        day === this.weekDays[this.weekDays.length - 1]
      ) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }

  setStatusFilter(status: string) {
    this.currentFilter = status;
  }

  getFilteredAppointmentsForDay(date: Date): Appointment[] {
    const appointments = this.getAppointmentsForDay(date);
    if (this.currentFilter === 'todos') {
      return appointments;
    }
    return appointments.filter((app) => app.estado === this.currentFilter);
  }

  showAppointmentDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
  }

  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.selectedAppointment = null;
    }
  }

  getAppointmentClasses(appointment: Appointment) {
    return {
      'appointment-pending': appointment.estado === 'pendiente',
      'appointment-confirmed': appointment.estado === 'confirmada',
      'appointment-cancelled': appointment.estado === 'cancelada',
      'appointment-completed': appointment.estado === 'completada',
    };
  }

  isToday(date: Date): boolean {
    return isToday(date);
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private loadAppointments() {
    this.isLoading = true;
    this.error = null;

    const fechaInicio = format(this.weekDays[0], 'yyyy-MM-dd');
    const fechaFin = format(
      this.weekDays[this.weekDays.length - 1],
      'yyyy-MM-dd'
    );

    const filters = {
      fechaInicio,
      fechaFin,
      ...(this.searchTerm && { pacienteCedula: this.searchTerm }),
    };

    this.citasService
      .getCitas(this.medicoCedula, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.error =
            'No se pudieron cargar las citas. Por favor, intente nuevamente.';
          this.isLoading = false;
        },
      });
  }

  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr, { locale: es });
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    const dateStr = format(date, 'yyyy-MM-dd');
    return this.appointments.filter(
      (appointment) =>
        format(new Date(appointment.fecha), 'yyyy-MM-dd') === dateStr
    );
  }

  aceptarCita(appointment: Appointment) {
    this.actualizarEstadoCita(
      appointment.id,
      'confirmada',
      'Cita aceptada por el médico'
    );
  }

  rechazarCita(appointment: Appointment) {
    this.actualizarEstadoCita(
      appointment.id,
      'cancelada',
      'Cita rechazada por el médico'
    );
  }

  private actualizarEstadoCita(
    id: string,
    nuevoEstado: string,
    motivo: string
  ) {
    this.citasService
      .actualizarCita(id, nuevoEstado, motivo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const citaIndex = this.appointments.findIndex(
            (cita) => cita.id === id
          );
          if (citaIndex !== -1) {
            this.appointments[citaIndex].estado = nuevoEstado;
          }
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error al actualizar la cita:', error);
          this.error =
            'Error al actualizar la cita. Por favor, intente nuevamente.';
        },
      });
  }
}
