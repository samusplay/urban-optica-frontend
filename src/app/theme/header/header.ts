import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { injectQuery } from '@tanstack/angular-query-experimental';
import { UserResponse } from '../../pages/profile-user/models/UserResponseDto';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  //saber si hay sesion
  isLogged=!!localStorage.getItem('token')

  //lee el usario si  esta logueado tanstack
  userQuery=injectQuery<UserResponse>(()=>({
    queryKey:['user-info'],
    enabled:this.isLogged,
    staleTime:Infinity
  }));

  //cerrar sesion
  logout(){
    localStorage.removeItem('token')
    window.location.href='auth/login'

  }

  //menu hamburgesa
  isMenuOpen=false;
   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }



}
