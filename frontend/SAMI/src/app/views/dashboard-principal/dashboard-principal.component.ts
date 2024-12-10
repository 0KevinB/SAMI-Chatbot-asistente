import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { pacientes } from './pacientes.mock';

@Component({
  selector: 'app-dashboard-principal',
  imports: [SlidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './dashboard-principal.component.html',
  styleUrl: './dashboard-principal.component.css',
  standalone: true,
})
export class DashboardPrincipalComponent {
  listaPacientes = pacientes;
}
