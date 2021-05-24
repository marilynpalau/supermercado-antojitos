import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFactura } from '../interfaces/factura.interface';
import { IFacturaDetalle } from '../interfaces/factura-detalle.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  factura: IFactura = {};
  facturaDetalle: IFacturaDetalle =  {};
  configUrlFactura = environment.urlApi + 'TEST_FACTURA';
  configUrlFacturaDetalle = environment.urlApi + 'TEST_FACTURA_DETALLE';

  public sendPostFacturaRequest(venta: IFactura) {
    return this.http.post(this.configUrlFactura, venta);
  }

  public sendPostFacturaDetalleRequest(venta: IFacturaDetalle) {
    return this.http.post(this.configUrlFacturaDetalle, venta);
  }

  public openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 2000
    });
  }

}
