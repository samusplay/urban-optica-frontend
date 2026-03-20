import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CartSignalService } from '../../core/interceptors/signals/cart.signal';
import { UserResponse } from '../../pages/profile-user/models/UserResponseDto';
import { UrlS3Pipe } from '../../pipes/url-s3-pipe';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink, RouterLinkActive,CommonModule,UrlS3Pipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(public cartSignal:CartSignalService){}
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

  // Lógica del menú del carrito
  isCartOpen = false;
  
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart() {
    this.isCartOpen = false;
  }



}
