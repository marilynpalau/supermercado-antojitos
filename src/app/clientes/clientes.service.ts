import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICliente } from '../interfaces/cliente.interface';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  cliente: ICliente = {};
  configUrl = environment.urlApi + 'TEST_CLIENTE';
  
  public sendGetIdRequest(identifiacion: number) {
    return this.http.get(this.configUrl + "/" + identifiacion);
  }
  
  public setCliente(cliente: ICliente) {
    this.cliente = cliente;
  }

  public getCliente() {
    return this.cliente;
  }

}
