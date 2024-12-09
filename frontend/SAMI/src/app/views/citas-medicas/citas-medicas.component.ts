import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [FullCalendarModule, HttpClientModule],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css',
})
export class CitasMedicasComponent {}
