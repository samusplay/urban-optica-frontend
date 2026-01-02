import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  //como definimos el pipe
  name: 'urlS3'
})
export class UrlS3Pipe implements PipeTransform {

  transform(path: string | null | undefined): string {
    // 1. Si no hay ruta (es null o vacio), devolvemos una imagen por defecto (opcional)
    if (!path) {
      return 'assets/img/sin-imagen.png'; 
    }

    // 2. Si la ruta ya viene completa (http...), la devolvemos tal cual
    if (path.startsWith('http')) {
      return path;
    }

    // 3. Magia: Concatenamos la URL del environment con el nombre del archivo
    return `${environment.s3Url}/${path}`;
  }
 
}
