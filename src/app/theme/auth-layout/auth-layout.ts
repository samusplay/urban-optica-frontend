import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {

  constructor(private router: Router) {}

  //Para redirigir 
isLoginRoute(): boolean {
  return this.router.url.includes('login');
}
}
