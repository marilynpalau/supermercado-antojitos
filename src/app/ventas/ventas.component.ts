import { Component, OnInit, ViewChild } from '@angular/core';
import { VentasService } from '../ventas/ventas.service';
import { ClientesService } from '../clientes/clientes.service';
import { ProductosService } from '../productos/productos.service';
import { IFactura } from '../interfaces/factura.interface';
import { IFacturaDetalle } from '../interfaces/factura-detalle.interface';
import { IProducto } from '../interfaces/producto.interface';
import { ClientesComponent } from '../clientes/clientes.component';
import { ProductosComponent } from '../productos/productos.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  @ViewChild('cliente') cliente: ClientesComponent;
  @ViewChild('productos') productos: ProductosComponent;

  constructor(private ventasService: VentasService,
    private clientesService: ClientesService,
    private productosService: ProductosService,
  ) { }

  fecha = (new Date()).toLocaleString("en-US");

  ngOnInit(): void {
  }

  factura: IFactura = {};
  facturaDetalle: IFacturaDetalle = {};

  validarVenta() {
    let cliente = this.clientesService.getCliente();
    let productos = this.productosService.getProductos();
    let total = this.productosService.getTotal();
    if (Object.keys(cliente).length == 0) {
      this.ventasService.openSnackBar("Seleccione un cliente", "OK");
    } else if (!productos.length) {
      this.ventasService.openSnackBar("Seleccione un producto", "OK");
    } else if (total == 0) {
      this.ventasService.openSnackBar("Seleccione la cantidad de los productos", "OK");
    } else {
      this.crearVenta(cliente, total, productos);
    }
  }

  crearVenta(c: any, t: number, p: any) {
    this.factura.IdCliente = c.IdCliente;
    this.factura.FechaVenta = this.fecha;
    this.factura.ValorTotal = t;
    this.ventasService.sendPostFacturaRequest(this.factura).subscribe((data: IFactura) => {
      // console.log(data);
      this.facturaDetalle.IdFactura = data.IdFactura;
      this.crearVentaDetalle(p);
    });
  }

  async crearVentaDetalle(p: IProducto[]) {
    for (let i = 0; i < p.length ; i++) {

      this.facturaDetalle.IdProducto = p[i].IdProducto;
      this.facturaDetalle.Cantidad = p[i].Cantidad;
      this.facturaDetalle.ValorUnidad = p[i].ValorUnidad;
      this.facturaDetalle.ValorTotal =  p[i].Subtotal;

      // disminuir cantidad
      let cantidad = p[i].Stock - this.facturaDetalle.Cantidad;
      p[i].Stock = cantidad;
      
      await this.ventasService.sendPostFacturaDetalleRequest(this.facturaDetalle).toPromise();
      await this.productosService.sendPutRequest(this.facturaDetalle.IdProducto, p[i]).toPromise();
    }

    this.ventasService.openSnackBar("Venta creada correctamente", "OK");
    this.resetForm();
  }

  resetForm() {
    this.cliente.resetForm();
    this.productos.resetForm();
    this.clientesService.setCliente({});
    this.productosService.setProductos([]);
    this.productosService.setTotal(0);

  }

}
