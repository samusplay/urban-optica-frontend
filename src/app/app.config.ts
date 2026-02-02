import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  provideTanStackQuery,
  QueryClient
} from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

const queryClient = new QueryClient();
export const appConfig: ApplicationConfig = {
  providers: [
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
   provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
   //Provedor tanStack
   provideTanStackQuery(queryClient)
  ]
};
