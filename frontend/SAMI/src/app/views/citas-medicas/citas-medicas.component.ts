import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [SlidebarComponent, CommonModule, HttpClientModule],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css',
})
export class CitasMedicasComponent {}
