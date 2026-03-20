import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';
import { OrderResponseDTO } from '../../carrito/models/OrderResponseDto';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private endpoint = "order";

  constructor(private readonly backend: BackendService) { }

  obtenerMisPedidos(): Observable<OrderResponseDTO[]> {
    return this.backend.get<OrderResponseDTO[]>(`${this.endpoint}/list`);
  }

}
