import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ServiceProfile } from '../../pages/profile-user/service/serviceprofile.service';


@Component({
  selector: 'app-profile-layout',
  standalone:true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss'
})
export class ProfileLayoutComponent {
// Controlar si el menú está colapsado en móvil
  isSidebarOpen = signal(true);
  //inyectar dependencias
  constructor(private readonly Serviceprofile:ServiceProfile){}

  //llamar tan stack para cacharlos
  public userQuery=injectQuery(()=>({
    queryKey:['user-info'],
    queryFn:()=>lastValueFrom(this.Serviceprofile.GetInfo()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    //permitir los datos anteriores mientra se busca
    placeholderData: (previousData: any) => previousData,
    //parpadeo
    refetchOnWindowFocus: false
  }))
    
  


  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

}
