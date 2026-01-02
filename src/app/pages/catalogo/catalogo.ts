import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UrlS3Pipe } from "../../pipes/url-s3-pipe";
import { Catalog } from "./model/catalog";
import { catalogoService } from "./services/catalogo.service";

@Component({
  selector: "app-catalogo",
  standalone: true,
  imports: [CommonModule,UrlS3Pipe],
  templateUrl: "./catalogo.html",
  styleUrl: "./catalogo.scss",
})
export class CatalogoComponent {
  // lo que viene desde el backend
  products: Catalog[] = []
  //Constructor solo para inyectar dependencias y codigo
  constructor(
    private readonly catalogoService: catalogoService,
    private readonly router: Router

  ) {

  }
  //cargamos la logica y construimos
  ngOnInit() {
    this.listProducts();
  }

  //Logica del negocio:Cargar Catalogo
  listProducts() {
    this.catalogoService.listProducts().subscribe({
      next: (data: Catalog[])=> {
        this.products = data;
      console.log("Productos cargados", this.products)
    },
      error: (err) => {
        console.error("Error al cargar el catalogo", err)
      }
    })
  }
  //Logica Para navegar por cada producto
  viewProductDetail(product:Catalog){
    console.log('El usuario quiere ver',product)
    this.router.navigate(['/producto',product.productId])

  }



}




