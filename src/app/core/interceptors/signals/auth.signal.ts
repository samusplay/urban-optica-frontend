import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSignalService {

  // La variable reactiva (el "timbre")
  private isLoggedSignal = signal<boolean>(false);
  public isLogged = this.isLoggedSignal.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkSession();
  }

  // Revisa si hay sesión al cargar la página
  public checkSession() {
    if (isPlatformBrowser(this.platformId)) {
      const hasToken = !!localStorage.getItem('token');
      this.isLoggedSignal.set(hasToken);
    }
  }

  // Guarda el token y avisa a toda la página
  public login(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.isLoggedSignal.set(true); 
    }
  }

  // Borra el token y oculta el menú del usuario
  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedSignal.set(false); 
    }
  }
}