import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { ProductDetail } from './model/productdetail';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto.html',
  styleUrl: './producto.scss',
})
export class ProductoComponent implements OnInit {

  //variables para la vista
  //Vamos guadar la informacion 
  product: ProductDetail | null = null;
  loading: boolean = true //Mostrar spinner

  //constrcutor para Inyectar Dependencias
  constructor(
    private route: ActivatedRoute,
    private readonly productService: ProductService
  ) {

  }
  ngOnInit() {
    //Capturamos el ID de la url
    const idstring = this.route.snapshot.paramMap.get('id');

    if (idstring) {
      //Convertimos de String a Number
      const idNumber = Number(idstring);

      //llamamos al servicio con el numero
      this.loadProduct(idNumber);
    } else {
      //Si no carga el id de la url
      this.loading = false;
    }
  }

  loadProduct(id: number) {
    //Llamamos al servicio
    this.productService.getProductId(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        console.log('Producto cargado', this.product);
      },
      //Capturamos el error
      error: (err) => {
        console.error('Error al cargar:', err)
        this.loading = false;
      }
    });

  }



}
