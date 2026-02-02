import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; // <--- Usamos SweetAlert por consistencia
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^\+57\d{9,10}$/)  // +57 + 9-10 dígitos (Colombia)
      ]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // ⚠️ Alerta visual si faltan datos
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    this.isLoading = true;
    
    // ⏳ Modal de carga
    Swal.fire({
      title: 'Creando tu cuenta...',
      text: 'Estamos registrando tus datos',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const registerData = this.form.value;  // teléfono ya viene formateado

    this.authService.register(registerData).subscribe({
      next: () => {
       //prepara datos para el login automatico
       const credenciales={
        email:this.form.value.email,
        password:this.form.value.password
       }
       //llamamos al login 
       this.authService.login(credenciales).subscribe({
        next:()=>{
          Swal.close(); // Cerramos el spinner de "Cargando..."

          // ✅ MODAL DE BIENVENIDA (Centrado, no Toast)
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: `Bienvenido a la plataforma, ${this.form.value.nombre}. Entrando...`,
            timer: 2000,              // Se queda 2 segundos para que lean
            showConfirmButton: false, // Sin botón para que sea fluido
            allowOutsideClick: false  // Evita que lo cierren antes de tiempo
          }).then(() => {
            // 🚀 Cuando termina el tiempo, nos vamos al dashboard
            this.router.navigate(['/dashboard']);
          });
        },
        error:(err)=>{
          console.warn('Auto-login falló:', err); // Para depurar

          // ⚠️ ATENCIÓN: Usamos 'warning' porque la cuenta SÍ se creó
          Swal.fire({
            icon: 'warning',
            title: 'Cuenta creada',
            text: 'Tu registro fue exitoso, pero hubo un problema al iniciar sesión automáticamente. Por favor ingresa manualmente.',
            confirmButtonText: 'Ir al Login',
            confirmButtonColor: '#2563eb',
            allowOutsideClick: false
          }).then(() => {
            // Los mandamos al login para que escriban su clave
            this.router.navigate(['/login']);
          });

        }
       })
      },
      error: (err) => {
        this.isLoading = false;
        
        // Manejo de error robusto
        const msg = err.error?.message || 'No se pudo registrar el usuario';
        
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: msg,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  get f() { return this.form.controls; }
}

