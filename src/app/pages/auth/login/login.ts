import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; // <--- Importamos SweetAlert
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  // Instanciamos formulario
  form: FormGroup;
  // Estado 
  isLoading = false;
  // Variable para guardar la url de retorno
  returnUrl: string = '/home'; 

  // Inyeccion de dependencias
  constructor(
    private readonly fb: FormBuilder,
    private readonly authservice: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute 
  ) {
    // Inicializamos el formulario
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Capturamos la URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  // Envio de datos
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // ⚠️ ERROR DE VALIDACIÓN
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, ingresa un correo y contraseña válidos.',
        confirmButtonColor: '#2563eb' // Tu azul corporativo
      });
      return;
    }

    // Cambiamos el estado
    this.isLoading = true;

    // ⏳ LOADING (Cargando...)
    // Mostramos un modal de carga que no se puede cerrar con clic afuera
    Swal.fire({
      title: 'Verificando credenciales...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Llamamos al servicio
    this.authservice.login(this.form.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.form.reset(); //Reset
        
        // ✅ ÉXITO
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola de nuevo, ${response.nombre}`,
          timer: 1500, // Se cierra solo en 1.5 segundos
          showConfirmButton: false
        }).then(() => {
          // Redirigimos AUTOMÁTICAMENTE cuando se cierra la alerta
           this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        
        // Calculamos el mensaje de error
        let message = 'Error al iniciar sesión';

        if (err.status === 401 || err.status === 403) {
           message = 'Correo o contraseña incorrectos';
        } else if (err.status === 0) {
           message = 'No se pudo conectar con el servidor. Revisa tu internet.';
        } else if (err.error?.message) {
           message = err.error.message;
        }

        // ❌ ERROR DEL SERVIDOR
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: message,
          confirmButtonColor: '#d33'
        });
        
        console.error('Error en Login:', err);
      }
    });
  }

  // Helper
  get f() {
    return this.form.controls;
  }
}
