import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { BackendService } from "../../../../services/backend.service";
import { Catalog } from "../model/catalog";
import { ProductDetail } from "../../producto/model/productdetail";

@Injectable({
  providedIn: "root",
})
export class catalogoService {
  private apiUrl = environment.apiUrl;
  private endpoint = "products";

  constructor(private readonly backend: BackendService) {}

  //Lista de funcionalidades
  //Get all products osea el catalogo
  listProducts(): Observable<Catalog[]> {
    return this.backend.get<Catalog[]>(this.endpoint);
  }

  //Get por el id  del producto para ver detalle del producto
  
}
