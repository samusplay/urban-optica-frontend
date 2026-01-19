import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

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
      toast.warning('Completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    const toastId = toast.loading('Creando tu cuenta...');

    const registerData = this.form.value;  // teléfono ya viene formateado

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading = false;
        toast.dismiss(toastId);
        toast.success('¡Registro exitoso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        toast.dismiss(toastId);
        toast.error(err.message || 'Error al registrar');
      }
    });
  }

  get f() { return this.form.controls; }
}

