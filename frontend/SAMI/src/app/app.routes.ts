import { Routes } from '@angular/router';
import { LoginMedicoComponent } from './views/login-medico/login-medico.component';
import { DashboardPrincipalComponent } from './views/dashboard-principal/dashboard-principal.component';
import { CitasMedicasComponent } from './views/citas-medicas/citas-medicas.component';
import { HistorialClinicoPacienteComponent } from './views/historial-clinico-paciente/historial-clinico-paciente.component';
import { VistaPacienteComponent } from './views/vista-paciente/vista-paciente.component';

export const routes: Routes = [
  { path: '', component: LoginMedicoComponent },
  { path: 'login-medico', component: LoginMedicoComponent },
  { path: 'dashboard-principal', component: DashboardPrincipalComponent },
  { path: 'dashboard-citas', component: CitasMedicasComponent },
  { path: 'perfil-paciente/:id', component: VistaPacienteComponent },
  { path: 'historial-clinico', component: HistorialClinicoPacienteComponent },
];
