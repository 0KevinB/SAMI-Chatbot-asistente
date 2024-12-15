import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  time: string;
  eventName: string;
  color: string;
}
interface Appointment {
  id: string;
  time: string;
  eventName: string;
  color: string;
}

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [SlidebarComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css',
})
export class CitasMedicasComponent implements OnInit {
  currentDate = new Date();
  weekDays: Date[] = [];
  appointments: Appointment[] = [
    {
      id: '1',
      time: '08:00',
      eventName: 'Consulta Dr. García',
      color: 'text-blue-500',
    },
    {
      id: '2',
      time: '09:00',
      eventName: 'Revisión Dra. López',
      color: 'text-green-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '4',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
    {
      id: '3',
      time: '10:00',
      eventName: 'Terapia Lic. Martínez',
      color: 'text-red-500',
    },
  ];
  searchTerm = '';

  ngOnInit() {
    const weekStart = startOfWeek(this.currentDate, { weekStartsOn: 1 });
    this.weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }

  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr, { locale: es });
  }
}
