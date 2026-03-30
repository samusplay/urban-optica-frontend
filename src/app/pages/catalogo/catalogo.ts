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
  products: Catalog[] = [];
  favorites: Set<string> = new Set(); // Para guardar favoritos
  
  //Constructor solo para inyectar dependencias y codigo
  constructor(
    private readonly catalogoService: catalogoService,
    private readonly router: Router
  ) {

  }
  //cargamos la logica y construimos
  ngOnInit() {
    this.listProducts();
    this.loadFavorites();
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

  // Agregar al carrito - redirige a página del producto para receta
  addToCart(product: Catalog) {
    console.log('Redirigiendo a detalle del producto para receta:', product.nombre);
    
    // Redirigir a la página del producto donde está el formulario de receta
    this.router.navigate(['/producto', product.productId]);
    
    // Mostrar feedback informativo
    this.showPrescriptionRequiredFeedback(product);
  }

  // Toggle de favoritos
  toggleFavorite(product: Catalog) {
    const productId = product.productId.toString();
    
    if (this.favorites.has(productId)) {
      this.favorites.delete(productId);
      console.log('Eliminado de favoritos:', product.nombre);
    } else {
      this.favorites.add(productId);
      console.log('Agregado a favoritos:', product.nombre);
    }
    
    // Guardar en localStorage
    this.saveFavorites();
  }

  // Verificar si es favorito
  isFavorite(product: Catalog): boolean {
    return this.favorites.has(product.productId.toString());
  }

  // Cargar favoritos desde localStorage
  private loadFavorites() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites = new Set(JSON.parse(saved));
    }
  }

  // Guardar favoritos en localStorage
  private saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(Array.from(this.favorites)));
  }

  // Feedback visual para requerimiento de receta
  private showPrescriptionRequiredFeedback(product: Catalog) {
    // Crear elemento temporal de feedback
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
      <div class="cart-feedback-content">
        <i class="bi bi-file-earmark-medical"></i>
        <span>Adjunta tu fórmula para agregar ${product.nombre}</span>
      </div>
    `;
    
    // Estilos para el feedback - corregido para no chocar con menú
    feedback.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
      z-index: 9999;
      animation: slideInUp 0.3s ease;
      font-weight: 600;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(feedback);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      feedback.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          document.body.removeChild(feedback);
        }
      }, 300);
    }, 3000);
  }
}




