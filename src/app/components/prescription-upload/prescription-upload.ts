import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../../pages/auth/services/auth.service";
import { formulaService } from "./services/formula.service";

@Component({
  selector: "app-prescription-upload",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./prescription-upload.html",
  styleUrl: "./prescription-upload.scss",
})
export class PrescriptionUpload {
  //Avisar al componente Padre ()
  @Output() prescriptionUploaded = new EventEmitter<number>();

  //Estados
  isLoading = false;
  uploadSuccess = false;
  selectedFile: File | null = null;

  //Logica del formulario
  form: FormGroup = new FormGroup({});

  //Inyectamos el servicio
  constructor(
    private readonly fb: FormBuilder,
    private readonly formulaService: formulaService,
    //Luego inyectar servicio de autenticacion
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.inicializarFormulario();
  }
  
  //Cargar los datos inciales
  ngOnInit() {
    //Si el usuario ya esta logueado cargamos su nombre
    if (this.authService.isSessionActive) {
      const userName = this.authService.getUserName();
      if (userName) {
        this.form.patchValue({ paciente: userName });
        //Bloquear nombre para que no lo editen
        this.form.get("paciente")?.disable();
      }
    }
  }

  //Metodo iniciar Formulario
  private inicializarFormulario(): void {
    this.form = this.fb.group({
      paciente: ["", [Validators.required, Validators.maxLength(100)]],
      observaciones: ["", [Validators.maxLength(500)]],
      fileSource: [null, [Validators.required]],
    });
  }

  // Se dispara cuando el usuario elige un archivo
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Validación de seguridad de formato (PDF/Word)
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowed.includes(file.type)) {
        Swal.fire("Formato no válido", "Solo se permite PDF o Word", "error");
        this.form.patchValue({ fileSource: null });
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.form.patchValue({ fileSource: file });
    }
  }

  //Enviamos al Backend
  onSubmit(): void {
    // 1. EL PORTERO: Verificamos sesión antes de nada
    if (!this.authService.isSessionActive) {
      Swal.fire({
        title: '¡Espera un momento!',
        text: 'Para enviarnos tu fórmula, necesitamos saber quién eres. Por favor regístrate o inicia sesión.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ir a Identificarme',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/' } });
        }
      });
      return; 
    }

    // 2. Validaciones normales del formulario
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      Swal.fire('Faltan datos', 'Por favor revisa el nombre y el archivo adjunto.', 'warning');
      return;
    }

    this.isLoading = true;

    // 3. RECUPERACIÓN SEGURA DEL ID (Aquí estaba el riesgo)
    const rawId = this.authService.getUserId();
    
    // 🛑 VALIDACIÓN CRÍTICA: Si no hay ID, no enviamos nada
    if (!rawId) {
        this.isLoading = false;
        Swal.fire('Error de Sesión', 'No pudimos identificar tu usuario. Por favor cierra sesión y vuelve a entrar.', 'error');
        console.error('Error: getUserId() retornó null o vacío. Revisa el AuthStorage.');
        return;
    }

    // Convertimos a número con seguridad
    const currentUserId = Number(rawId);

    // DTO listo para enviar
    const dto = {
      userId: currentUserId, 
      observaciones: this.form.get('observaciones')?.value,
      file: this.selectedFile // Enviamos el archivo físico
    };

    console.log('Enviando fórmula con ID:', currentUserId); // Log para confirmar

    this.formulaService.uploadPrescription(dto).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.uploadSuccess = true;
        this.form.disable(); 

        Swal.fire({
          title: '¡Recibido!',
          text: 'Hemos recibido tu fórmula correctamente.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });

        this.prescriptionUploaded.emit(res.id);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al subir:', err);
        
        // Manejo de errores de servidor
        if(err.status === 401 || err.status === 403) {
            Swal.fire('Sesión caducada', 'Por favor vuelve a iniciar sesión.', 'warning');
            this.authService.logout();
            this.router.navigate(['/auth/login']);
        } else {
            // Si el backend manda mensaje de error (ej: "Archivo muy pesado"), mostramos eso
            const msg = err.error?.message || 'No pudimos subir el archivo. Intenta de nuevo.';
            Swal.fire('Error al subir', msg, 'error');
        }
      }
    });
  }
}
