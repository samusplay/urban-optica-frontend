import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { PedidosService } from './services/pedidos-service.service';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, RouterLink],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent {

  private pedidosService=inject(PedidosService)

  pedidosQuery=injectQuery(()=>({
    queryKey:['mis-pedidos'],
    queryFn:()=>lastValueFrom(this.pedidosService.obtenerMisPedidos()),
  }));

}
