import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class HomeComponent implements OnInit, OnDestroy {
  //Logica de slide

  //Identiicador unico para manejar el slide
  carouselId = "carouselHome";

  // Luego podemos migrar a S3 o algún otro servicio de almacenamiento
  slides = [
    { 
      src: "carousel/slide-1.jpg", 
      alt: "Venta de lentes por internet",
      title: "¡Lentes por Internet!",
      description: "Compra tus lentes desde la comodidad de tu hogar con solo unos clics"
    },
    { 
      src: "carousel/slide-2.jpg", 
      alt: "Envíos a todo el país",
      title: "Envíos a Todo el País",
      description: "Recibe tus lentes en la puerta de tu casa, dondequiera que estés"
    },
    { 
      src: "carousel/slide-3.jpg", 
      alt: "Tienda online de lentes",
      title: "Tu Óptica Online",
      description: "La mejor selección de lentes con envíos seguros y rápidos"
    },
  ];

  private carouselInstance: any;

  constructor() {}

  ngOnInit() {
    // Inicializar el carrusel después de que el DOM esté listo
    setTimeout(() => {
      this.initializeCarousel();
    }, 100);
  }

  ngOnDestroy() {
    // Limpiar la instancia del carrusel al destruir el componente
    if (this.carouselInstance) {
      this.carouselInstance.dispose();
    }
  }

  private initializeCarousel() {
    const carouselElement = document.getElementById(this.carouselId);
    if (carouselElement && (window as any).bootstrap) {
      this.carouselInstance = new (window as any).bootstrap.Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true,
        keyboard: true
      });
    }
  }
}
