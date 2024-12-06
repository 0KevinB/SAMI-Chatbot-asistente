import { Routes } from '@angular/router';
import { LoginMedicoComponent } from './views/login-medico/login-medico.component';
import { DashboardPrincipalComponent } from './views/dashboard-principal/dashboard-principal.component';

export const routes: Routes = [
    { path: '', component: LoginMedicoComponent },
    { path: 'login-medico', component: LoginMedicoComponent },
    { path: 'dashboard-principal', component: DashboardPrincipalComponent }
];
