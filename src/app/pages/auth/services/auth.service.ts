import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { BackendService } from "../../../../services/backend.service";
import { AuthResponse } from "../model/AuthResponse";
import { LoginRequest } from "../model/LoginRequest";
import { RegisterRequest } from "../model/RegisterRequest";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private endpoint = "auth";

  //Verificar si hay token primero
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  //Escuchar todos los componentes
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private readonly backend: BackendService) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    // CAMBIO CLAVE: Solo enviamos "auth/register"
    const path = `${this.endpoint}/register`;

    return this.backend.post<AuthResponse>(path, request).pipe(
      tap((response) => this.saveAuthData(response)),
      catchError((err) => {
        console.error("Error en register:", err);
        return throwError(() => err);
      }),
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    // CAMBIO CLAVE: Solo enviamos "auth/login"
    const path = `${this.endpoint}/login`;

    return this.backend.post<AuthResponse>(path, request).pipe(
      tap((response) => this.saveAuthData(response)),
      catchError((err) => {
        console.error("Error en login:", err);
        return throwError(() => err);
      }),
    );
  }

  /**
   * LOGOUT
   * Borra datos y grita "FALSE" por el noticiero.
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    //agregamos que cuando salga elimine el id
    localStorage.removeItem("userId")

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
    return localStorage.getItem("userRole");
  }

  /**
   * HELPER: Obtener Token (Para el Interceptor que haremos luego)
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }
  /** Obtiene el nombre guardado para mostrarlo en formularios */
  getUserName(): string | null {
    return localStorage.getItem("userName");
  }

  /** Obtiene el ID para enviarlo en los POST de fórmulas */
  getUserId(): string | null {
    return localStorage.getItem("userId");
  }

  // --- MÉTODOS PRIVADOS ---
  private saveAuthData(response: AuthResponse): void {
    
    // 1. Guardar Token
    localStorage.setItem("token", response.token);

    // 2. Guardar Datos Básicos (Directos, sin buscar dentro de 'user')
    if (response.nombre) localStorage.setItem("userName", response.nombre);
    if (response.role) localStorage.setItem("userRole", response.role);

    // 3. Guardar ID (Sin miedo al éxito)
    if (response.id) {
        console.log('✅ Login: ID guardado ->', response.id);
        localStorage.setItem("userId", response.id.toString());
    } else {
        console.error('❌ Login: El backend no envió el ID');
    }

    this.isLoggedInSubject.next(true);
  }


  // Verifica si existe un token físico en el navegador
  private hasToken(): boolean {
    return !!localStorage.getItem("token");
  }
}
