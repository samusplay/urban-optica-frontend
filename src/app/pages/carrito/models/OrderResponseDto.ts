import { CartItem } from "./CartItem";

export type OrderItemResponseDto=Omit<CartItem,'stockDisponible'>&{
    subTotal:number
}

//la orden completa a devolver
export interface OrderResponseDTO {
  id: number;
  total: number;
  estado: string; // 'PENDIENTE', 'CANCELADO', etc.
  metodoPago: string;
  shippingAddress: string;
  fecha: string; 
  items: OrderItemResponseDto[];
}