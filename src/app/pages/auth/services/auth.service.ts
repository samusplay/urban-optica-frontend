import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BackendService } from '../../../../services/backend.service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { RegisterRequest } from '../model/RegisterRequest';
import { AuthResponse } from '../model/AuthResponse';
import { LoginRequest } from '../model/LoginRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint = "auth";

  //Verificar si hay token primero
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  //Escuchar todos los componentes 
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private readonly backend: BackendService) { }

 register(request: RegisterRequest): Observable<AuthResponse> {
    // CAMBIO CLAVE: Solo enviamos "auth/register"
    const path = `${this.endpoint}/register`; 
    
    return this.backend.post<AuthResponse>(path, request).pipe(
      tap(response => this.saveAuthData(response)),
      catchError(err => {
        console.error('Error en register:', err);
        return throwError(() => err);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    // CAMBIO CLAVE: Solo enviamos "auth/login"
    const path = `${this.endpoint}/login`;

    return this.backend.post<AuthResponse>(path, request).pipe(
      tap(response => this.saveAuthData(response)),
      catchError(err => {
        console.error('Error en login:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * LOGOUT
   * Borra datos y grita "FALSE" por el noticiero.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    // Avisamos a la app que se cerró la sesión
    this.isLoggedInSubject.next(false);
  }

  /**
   * HELPER: Obtener el valor actual sin suscribirse (Útil para Guards)
   */
  get isSessionActive(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * HELPER: Obtener Rol (Para ocultar botones de admin en el HTML)
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
  
  /**
   * HELPER: Obtener Token (Para el Interceptor que haremos luego)
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- MÉTODOS PRIVADOS ---

  // Guarda en disco y actualiza el estado
  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userName', response.nombre); // Asumiendo que tu DTO trae 'nombre'
    localStorage.setItem('role', response.role);     // Asumiendo que tu DTO trae 'role'
    
    // ¡Avisamos que ya estamos logueados!
    this.isLoggedInSubject.next(true);
  }

  // Verifica si existe un token físico en el navegador
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

  
  

