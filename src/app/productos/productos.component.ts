import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { VentasService } from '../ventas/ventas.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IProducto } from '../interfaces/producto.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  constructor(private productosService: ProductosService,
    private ventasService: VentasService,
    private fb: FormBuilder) { }

  total = 0;
  productoModel: FormGroup;
  productosSeleccionados: IProducto[] = [];
  cantidades = new FormArray([]);

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.productoModel = this.fb.group({
      codigo: [null]
    });
  }

  addCantidades() {
    this.cantidades.push(new FormControl(1));
  }

  resetForm() {
    this.total = 0;
    this.productosSeleccionados = [];
    this.cantidades = new FormArray([]);
  }

  getProducto() {
    if (this.productoModel.value.codigo == null) {
      this.ventasService.openSnackBar("Debe digitar un producto", "OK");
    } else {
      this.productosService.sendGetIdRequest(this.productoModel.value.codigo).subscribe((data: any) => {
        // console.log(data);
        if (!data.length) {
          this.ventasService.openSnackBar("No se encontro un producto con ese código", "OK");
        } else {
          let index = this.productosSeleccionados.findIndex(item => item.IdProducto == data[0].IdProducto);
          if (index < 0) {
            data[0].Subtotal = data[0].ValorUnidad;
            data[0].Cantidad = 1;
            this.productosSeleccionados.push(data[0]);
            this.addCantidades();
            this.calcularTotal();
          } else {
            this.calcularSubtotal(null, this.productosSeleccionados[index]);
          }

          this.enviarProductos();
          this.productoModel.reset();
          
        }
      });
    }
  }

  calcularSubtotal(event: any = null, fila: any) {
    let cantidad = 0;
    let index = this.productosSeleccionados.findIndex(item => item.IdProducto == fila.IdProducto);
    if (event) {
      cantidad = event.target.value;
    } else {
      cantidad = this.cantidades.controls[index].value + 1;
      this.cantidades.controls[index].setValue(cantidad);
    }

    if (cantidad > fila.Stock) {
      this.ventasService.openSnackBar("No hay unidades disponibles de este producto", "OK");
      this.eliminar(fila);
    } else {
      let subtotal = cantidad * fila.ValorUnidad;
      this.productosSeleccionados[index].Cantidad = cantidad;
      this.productosSeleccionados[index].Subtotal = subtotal;
      this.calcularTotal();
    }
    
  }

  enviarProductos() {
    this.productosService.setProductos(this.productosSeleccionados);
  }

  calcularTotal() {
    let total = 0;
    for (const item in this.productosSeleccionados) {
      if (Object.prototype.hasOwnProperty.call(this.productosSeleccionados, item)) {
        const element = this.productosSeleccionados[item];
        // sumatoria    
        total += element.Subtotal;
      }
    }
    this.total = total;
    this.productosService.setTotal(this.total);
  }

  eliminar(fila: any) {
    let index = this.productosSeleccionados.findIndex(item => item.IdProducto == fila.IdProducto);
    this.cantidades.removeAt(index);
    this.productosSeleccionados.splice(index, 1);
    this.calcularTotal();
  }

}
