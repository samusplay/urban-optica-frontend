import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../../../pages/carrito/models/CartItem';
// Importa el DTO o modelo que creaste antes (ajusta la ruta)


@Injectable({
  providedIn: 'root'
})
export class CartSignalService {

  // 1. La Signal principal (Nuestra variable reactiva que guarda el arreglo)
  private cartItemsSignal = signal<CartItem[]>([]);

  // 2. Signals computadas (Se actualizan solas cuando el arreglo cambia)
  public cartItems = this.cartItemsSignal.asReadonly();
  
  public totalItems = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + item.cantidad, 0)
  );

  public grandTotal = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0)
  );

  // 3. Funciones para modificar el carrito
  public addToCart(newItem: CartItem) {
    this.cartItemsSignal.update(items => {
      // Validamos si ya existe
      const index = items.findIndex(i => 
        i.productId === newItem.productId && i.prescriptionId === newItem.prescriptionId
      );

      if (index !== -1) {
        const updated = [...items];
        updated[index].cantidad += newItem.cantidad;
        return updated;
      }
      return [...items, newItem];
    });
  }

  public removeFromCart(productId: number, prescriptionId?: number | null) {
    this.cartItemsSignal.update(items => 
      items.filter(i => !(i.productId === productId && i.prescriptionId === prescriptionId))
    );
  }

  public clearCart() {
    this.cartItemsSignal.set([]);
  }
}