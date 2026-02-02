import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-profile-layout',
  standalone:true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss'
})
export class ProfileLayoutComponent {
// Controlar si el menú está colapsado en móvil
  isSidebarOpen = signal(true);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

}
