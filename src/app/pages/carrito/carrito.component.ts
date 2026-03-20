import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { CartSignalService } from '../../core/interceptors/signals/cart.signal';
import { UrlS3Pipe } from '../../pipes/url-s3-pipe';
import { OrderItemRequestDto } from './models/CartItem';
import { OrderRequestDto } from './models/OrderRequestDto';
import { CarritoService } from './service/carrito-service.service';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink, UrlS3Pipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  //inyeccion de dependencias
  public cartSignal = inject(CartSignalService)
  private carritoService = inject(CarritoService)
  private router = inject(Router)

  shippingAddress: string = '';
  metodoPago: string = 'MERCADO_PAGO'

  //Mutuaciones
  crearPedidoMutation = injectMutation(() => ({
    mutationFn: (pedido: OrderRequestDto) => lastValueFrom(this.carritoService.crearPedido(pedido)),
    onSuccess: (respuesta) => {
      //limpiamos el carrito
      this.cartSignal.clearCart();
      Swal.fire({
        title: '¡Pedido Confirmado!',
        text: 'Tu orden ha sido procesada con éxito.',
        icon: 'success',
        confirmButtonColor: '#198754'
      }).then(() => {
        // 3. Redirigimos al historial de pedidos (Ajusta la ruta a tu página de pedidos)
        this.router.navigate(['/pedidos']);
      });
    },
    onError:(error)=>{
      Swal.fire('Ups...', 'Hubo un error al procesar tu pago. Inténtalo de nuevo.', 'error');
    }
  }));

  //funcion procesar pago
  procesarPago(){
    //validaciones
    if (!this.shippingAddress.trim()) {
      Swal.fire('Dirección requerida', 'Por favor ingresa tu dirección de envío.', 'warning');
      return;
    }
    //mapeamos dto
    const itemsLimpios: OrderItemRequestDto[] = this.cartSignal.cartItems().map(item => ({
      productId: item.productId,
      cantidad: item.cantidad,
      prescriptionId: item.prescriptionId
    }));
    //armar paylodad
    const pedidoFinal: OrderRequestDto = {
      shippingAddress: this.shippingAddress,
      paymentMethod: this.metodoPago,
      items: itemsLimpios
    };
    //debugging
    console.log('Enviando pedido a Spring Boot:', pedidoFinal);

    //post de tanstack
    this.crearPedidoMutation.mutate(pedidoFinal);
  }


}
