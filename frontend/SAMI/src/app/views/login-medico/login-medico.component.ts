import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './../../services/auth.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-medico',
  templateUrl: './login-medico.component.html',
  styleUrls: ['./login-medico.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule], // Asegúrate de incluirlo aquí
  providers: [AuthService], // Declara el servicio como proveedor
})
export class LoginMedicoComponent {
  cedula = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.cedula && this.password) {
      this.authService
        .login({ cedula: this.cedula, password: this.password })
        .subscribe(
          (response) => {
            const token = response.token;
            this.authService.saveToken(token);

            const decodedToken = this.authService.getDecodedToken();
            if (decodedToken && decodedToken.role === 'medico') {
              console.log('Acceso permitido, rol médico');
              this.router.navigate(['/dashboard']);
            } else {
              console.error('Acceso denegado, rol no permitido');
              alert('Solo los médicos pueden acceder');
              this.authService.logout();
            }
          },
          (error) => {
            console.error('Error al iniciar sesión:', error);
            alert('Credenciales incorrectas');
          }
        );
    } else {
      alert('Por favor, complete todos los campos');
    }
  }
}
