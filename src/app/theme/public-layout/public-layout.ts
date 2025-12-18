import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Footer } from '../footer/footer';
import { Header } from "../header/header";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [Header,Footer, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {

}
