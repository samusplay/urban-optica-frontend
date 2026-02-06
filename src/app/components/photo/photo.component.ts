import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import Swal from 'sweetalert2';
import { PhotoService } from './service/photoservice.service';

@Component({
  selector: 'app-photo',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
//solo eejcuta una accion (evento)
export class PhotoComponent {
  //queryclient para usarlo
  private queryClient=inject(QueryClient);

  constructor(private readonly servicePhoto:PhotoService){}

  onFileSelected(event:Event){
    //convertimos el evento en un input
    const input=event.target as HTMLInputElement

    //si no hay un archivo selecionado
    if(!input.files?.length)return;

    //tomar el archivo selecionado
    const file=input.files[0]

    //llamamos al servicio
    this.servicePhoto.uploadPhoto({file}).subscribe({
      next:()=>{
        //invalidar para recargar
        this.queryClient.invalidateQueries({
          queryKey:['user-info']
        });
         Swal.fire({
          icon: 'success',
          title: 'Foto actualizada',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      },
      //manejo de errores
      error:()=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al subir la foto',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  }


}
