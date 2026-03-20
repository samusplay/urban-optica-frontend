import { OrderItemRequestDto } from "./CartItem";

//Objeto que enviamos al Backend
export interface OrderRequestDto{
    shippingAddress: string
    paymentMethod: string;
    items:OrderItemRequestDto[]


}