import { Injectable } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { OrderRequestDto } from '../models/OrderRequestDto';
import { OrderResponseDTO } from '../models/OrderResponseDto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private endpoint = "order";

  constructor(private readonly backend: BackendService) { }

  //lista de funcionalidades

  //crear Pedido
  crearPedido(pedido: OrderRequestDto) {
    return this.backend.post<OrderResponseDTO>(`${this.endpoint}/create`, pedido)
  }

  //ver detalle del pedido
  obtenerDetallePedido(orderId:number,userId:number){
    return this.backend.get<OrderResponseDTO>(`${this.endpoint}/${orderId}?userId=${userId}`)
  }

}
