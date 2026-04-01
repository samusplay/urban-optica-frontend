import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthSignalService } from './signals/auth.signal'; // Revisa que esta ruta sea la correcta a tu archivo

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Extraemos el token del localStorage
  const token = localStorage.getItem('token');
  
  // 2. Inyectamos los servicios necesarios
  const router = inject(Router);
  const authSignal = inject(AuthSignalService);

  // 3. Preparamos la petición. Si hay token, la clonamos y se lo ponemos. Si no, se queda igual.
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 4. UN SOLO RETURN. Enviamos la petición y estamos atentos a los errores
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend nos dice que no estamos autorizados (401 o 403)
      if (error.status === 401 || error.status === 403) {
        console.warn('Token expirado o inválido. Cerrando sesión automáticamente.');
        
        // Limpiamos la casa usando nuestra señal
        authSignal.logout();
        
        // Redirigimos al usuario para que vuelva a iniciar sesión
        router.navigate(['/auth/login']);
      }
      
      // Dejamos que el error siga su camino por si otro componente lo necesita
      return throwError(() => error);
    })
  );
};