import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { catalogoService } from "./services/catalogo.service";

@Component({
  selector: "app-catalogo",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./catalogo.html",
  styleUrl: "./catalogo.scss",
})
export class CatalogoComponent {
  //Constructor
  constructor(private readonly catalogoService: catalogoService) {
    this.listProducts();
  }

  //Logica del negocio

  listProducts() {}

}
