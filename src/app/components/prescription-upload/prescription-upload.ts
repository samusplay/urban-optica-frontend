import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formulaService } from './services/formula.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prescription-upload',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './prescription-upload.html',
  styleUrl: './prescription-upload.scss',
})
export class PrescriptionUpload {

  //Avisar al componente Padre ()
  @Output() prescriptionUploaded = new EventEmitter<number>();

  //Estados
  isLoading=false;
  uploadSuccess=false;
  selectedFile:File |null=null

  //Logica del formulario
  form:FormGroup=new FormGroup({})

  //Inyectamos el servicio
  constructor(
    private readonly fb:FormBuilder,
    private readonly formulaService:formulaService
    //Luego inyectar servicio de autenticacion
  ){
    this.inicializarFormulario();

  }
  //Cargar los datos inciales
  ngOnInit(){

  }
  //Metodo iniciar Formulario
  private inicializarFormulario(): void {
    this.form = this.fb.group({
      // Por ahora dejamos el nombre manual o vacío hasta tener Auth
      paciente: ['', [Validators.required, Validators.maxLength(100)]],
      observaciones: ['', [Validators.maxLength(500)]],
      fileSource: [null, [Validators.required]] 
    });
  }
  // Se dispara cuando el usuario elige un archivo
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Validación de seguridad de formato (PDF/Word)
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowed.includes(file.type)) {
        Swal.fire('Formato no válido', 'Solo se permite PDF o Word', 'error');
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
    // Si el formulario no es válido, marcamos los campos para que se pongan rojos
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      return;
    }

    // Iniciamos estado de carga
    this.isLoading = true;

    // Preparamos el DTO (Objeto de transferencia de datos)
    const dto = {
      // userId: this.authService.getUserId(), // <--- CAMBIAR POR ID REAL LUEGO
      userId: 1, // Por ahora usamos ID 1 para que tu backend no falle
      observaciones: this.form.get('observaciones')?.value,
      file: this.selectedFile
    };

    // Llamamos al servicio que creamos antes
    this.formulaService.uploadPrescription(dto).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.uploadSuccess = true;
        this.form.disable(); // Bloqueamos el formulario

        Swal.fire({
          title: '¡Fórmula Adjuntada!',
          text: 'Se ha guardado tu fórmula médica.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });

        // 📢 IMPORTANTE: Enviamos el ID de la base de datos al componente padre
        this.prescriptionUploaded.emit(res.id);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al subir fórmula', err);
        Swal.fire('Error', 'No se pudo subir el archivo. Revisa tu conexión.', 'error');
      }
    });
  }



}
