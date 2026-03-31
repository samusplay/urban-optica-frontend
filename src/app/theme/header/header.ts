import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CartSignalService } from '../../core/interceptors/signals/cart.signal';
import { AuthSignalService } from '../../core/interceptors/signals/auth.signal'; 
import { UserResponse } from '../../pages/profile-user/models/UserResponseDto';
import { UrlS3Pipe } from '../../pipes/url-s3-pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, UrlS3Pipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public cartSignal = inject(CartSignalService);
  public authSignal = inject(AuthSignalService); // <-- Inyectamos la señal
  private router = inject(Router);

  // TanStack reaccionará automáticamente cuando authSignal cambie
  userQuery = injectQuery<UserResponse>(() => ({
    queryKey: ['user-info'],
    enabled: this.authSignal.isLogged(), 
    staleTime: Infinity
  }));

  logout() {
    this.authSignal.logout(); 
    this.isMenuOpen = false; 
    this.router.navigate(['/auth/login']); 
  }

  isMenuOpen = false;
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu() { this.isMenuOpen = false; }

  isCartOpen = false;
  toggleCart() { this.isCartOpen = !this.isCartOpen; }
  closeCart() { this.isCartOpen = false; }
}