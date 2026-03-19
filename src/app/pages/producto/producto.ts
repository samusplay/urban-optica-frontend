import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { PrescriptionUpload } from '../../components/prescription-upload/prescription-upload';
import { CartSignalService } from '../../core/interceptors/signals/cart.signal';
import { UrlS3Pipe } from '../../pipes/url-s3-pipe';
import { CartItem } from '../carrito/models/CartItem';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, RouterLink, UrlS3Pipe, PrescriptionUpload],
  templateUrl: './producto.html',
  styleUrl: './producto.scss',
})
export class ProductoComponent  {
  //refactorizacion
  private route=inject(ActivatedRoute)
  private productService=inject(ProductService)
  public cartSignal=inject(CartSignalService)

  //ID URL
  private productId=Number(this.route.snapshot.paramMap.get('id'))

  //query
  productQuery=injectQuery(()=>({
    queryKey:['product-detail',this.productId],
    queryFn:()=>lastValueFrom(this.productService.getProductId(this.productId)),
    enabled:!! this.productId
  }));

  prescriptionId:number |null=null

  onPrescriptionAttached(id: number) {
    this.prescriptionId = id;
  }
  addToCart(){
    const productData=this.productQuery.data();

    if(!productData ||!this.prescriptionId)return

    const newItem: CartItem = {
      productId: productData.productId, 
      nombreProducto: productData.nombre,
      precioUnitario: productData.precio,
      imagenProducto: productData.imagenKey,
      cantidad: 1, 
      stockDisponible: productData.stock, 
      prescriptionId: this.prescriptionId 
    };
    //llamamos al signal
    this.cartSignal.addToCart(newItem)

    Swal.fire({
      title: '¡Agregado!',
      text: `${productData.nombre} se añadió al carrito.`,
      icon: 'success',
      confirmButtonColor: '#0d6efd',
      timer: 2000,
      showConfirmButton: false
    });
  }

 


}
