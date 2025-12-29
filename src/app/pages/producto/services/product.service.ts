import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BackendService } from '../../../../services/backend.service';
import { Observable } from 'rxjs';
import { ProductDetail } from '../model/productdetail';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private endpoint = "products";

  constructor(private readonly backend: BackendService) {}

  //Traer Producto Por id
  getProductId(id:number):Observable<ProductDetail>{
    return this.backend.get<ProductDetail>(`${this.endpoint}/${id}`)
  }
  
}
