import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IProducto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  configUrl = environment.urlApi + 'TEST_PRODUCTO';
  productos: IProducto[] = [];
  total = 0;

  public sendGetIdRequest(codigo: string) {
    return this.http.get(this.configUrl + "/" + codigo);
  }

  public sendPutRequest(codigo: number, producto: IProducto) {
    return this.http.put(this.configUrl + "/" + codigo, producto);
  }

  public setProductos(productos: IProducto[]) {
    this.productos = productos;
  }

  public getProductos() {
    return this.productos;
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public getTotal() {
    return this.total;
  }

}
