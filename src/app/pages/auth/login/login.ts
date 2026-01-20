import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  //instacniamos formulario
  form: FormGroup;
  //estado 
  isLoading = false;

  //Inyeccion de dependencias
  constructor(
    private readonly fb: FormBuilder,
    private readonly authservice: AuthService,
    private readonly router: Router

  ) {
    //Inicializamos el formulario
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  //Envio de datos
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      toast.warning('Por favor, ingresa credenciales válidas')
      return;
    }
    //Cambiamos el estado
    this.isLoading = true;
    const toastId = toast.loading('Verificando credenciales...');

    //Llamamos al servicio
    this.authservice.login(this.form.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        toast.dismiss(toastId)
        toast.success(`¡Bienvenido de nuevo, ${response.nombre}!`)

        //Redirigimos al home/luego A users
        this.router.navigate(['/home'])
      },
      error: (err) => {
        this.isLoading = false;
        toast.dismiss(toastId);
        //Manejamos errores
        const message = err.status === 401
          ? 'Correo o contraseña incorrectos'
          : err.error?.message || 'Error al iniciar sesión';

        toast.error(message);
        console.error('Error en Login:', err);
      }
    });
  }
  //Usamos helper
  get f() {
    return this.form.controls;
  }


}
