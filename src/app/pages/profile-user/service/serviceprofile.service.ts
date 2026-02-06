import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { UserResponse } from '../models/UserResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceProfile {
  //endoint de informacion user
  private endpoint='user'

  constructor(private readonly backend:BackendService){}

  //funcionalidades usaando el dto
  GetInfo():Observable<UserResponse>{
    return this.backend.get<UserResponse>(`${this.endpoint}/info`)

  }
 
}
