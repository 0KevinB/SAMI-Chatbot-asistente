import { Routes } from '@angular/router';
import { LoginMedicoComponent } from './views/login-medico/login-medico.component';

export const routes: Routes = [
    { path: '', component: LoginMedicoComponent },
    { path: 'login-medico', component: LoginMedicoComponent }
];
