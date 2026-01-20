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
        this.isLoading = false;
        
        // ⬇️⬇️⬇️ MAGIA: Reseteamos y quitamos "lo rojo"
        this.form.reset();
        Object.keys(this.form.controls).forEach(key => {
          const control = this.form.get(key);
          control?.setErrors(null);      // Quita error interno
          control?.markAsPristine();     // Marca como "no sucio"
          control?.markAsUntouched();    // Marca como "no tocado" (Quita borde rojo)
        });

        // ✅ Éxito y redirección
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Bienvenido a Óptica Urbana',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/home']);
        });
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

