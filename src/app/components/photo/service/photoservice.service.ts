import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { PhotoUpload } from '../models/PhotoUploadDto';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private endpoint="photo"

  constructor(private readonly backend:BackendService) { }

  
  uploadPhoto(data:PhotoUpload):Observable<any>{
    const formData=new FormData()
    //traer el dto al fromData
    formData.append('file',data.file)
    //retornamos ala solicitud PATCH
    return this.backend.patch<any>(`${this.endpoint}/upload`, formData)


  }


}
