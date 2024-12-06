import { Component } from '@angular/core';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';

@Component({
  selector: 'app-dashboard-principal',
  imports: [SlidebarComponent],
  templateUrl: './dashboard-principal.component.html',
  styleUrl: './dashboard-principal.component.css',
  standalone: true
})
export class DashboardPrincipalComponent {

}
