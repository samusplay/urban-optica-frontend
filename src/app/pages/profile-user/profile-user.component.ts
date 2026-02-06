import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UserResponse } from './models/UserResponseDto';
import { ServiceProfile } from './service/serviceprofile.service';

@Component({
  selector: 'app-profile-user',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent {

  //inyectamos constructor
  constructor(
    private readonly serviceprofile:ServiceProfile
  ){

  }
  //llave par cacharla
  public userQuery = injectQuery(()=>({
    queryKey: ['user-info'],
    queryFn: () => this.GetUserInfo(),
    retry: 2
  }))

 

   private GetUserInfo=async():Promise<UserResponse>=>{
    try {
      //convertimos de obersavble a una promesa
      return await lastValueFrom(this.serviceprofile.GetInfo())
    } catch (error) {
      this.HandleErrorAlert()
      throw error;
    }
   }
   //metodo para manejar lo que se muestra en el modal
   private HandleErrorAlert = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error de Conexión',
      text: 'No se pudo sincronizar la información de la óptica.',
      confirmButtonColor: '#0d6efd',
      toast: true, // Lo hace menos intrusivo para un SaaS profesional
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    });
  }

  

}
