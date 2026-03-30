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

  // Videos para el carrusel
  slides = [
    { 
      src: "video/clip1.mp4", 
      alt: "Video de lentes premium",
      title: "LENTES EN INTERNET",
      description: "Compra tus lentes online con la mejor calidad y envío a domicilio"
    },
    { 
      src: "video/clip2.mp4", 
      alt: "Video de servicios ópticos",
      title: "LENTES EN INTERNET",
      description: "La tienda online más confiable para tus lentes y productos ópticos"
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
