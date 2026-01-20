import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CommonModule,RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Aquí actualizamos la variable que el HTML está mirando
      this.currentUrl = event.url; 
    });
  }

  isLoginRoute(): boolean {
    // CAMBIO AQUÍ: Usa la variable de clase, no el router directamente
    return this.currentUrl.includes('login');
  }
}



