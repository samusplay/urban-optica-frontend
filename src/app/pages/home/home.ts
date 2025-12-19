import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: "app-home",
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class HomeComponent {
  //Logica de slide

  //Identiicador unico para manejar el slide
  carouselId = "carouselHome";

  // Luego podemos migrar a S3 o algún otro servicio de almacenamiento
  slides = [
    { 
      src: "carousel/slide-1.jpg", 
      alt: "Promoción en monturas",
      title: "¡Gran Oferta en Monturas!",
      description: "Hasta 40% de descuento en nuestra selección de monturas"
    },
    { 
      src: "carousel/slide-2.jpg", 
      alt: "Lentes para sol",
      title: "Lentes de Sol de Marca",
      description: "Protege tus ojos con estilo esta temporada"
    },
    { 
      src: "carousel/slide-3.jpg", 
      alt: "Examen visual",
      title: "Examen Visual Completo",
      description: "Agenda tu cita hoy mismo con nuestros especialistas"
    },
  ];
}
