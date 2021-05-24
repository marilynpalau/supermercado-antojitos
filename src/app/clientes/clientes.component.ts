import { Component, OnInit } from '@angular/core';
import { ClientesService } from './clientes.service';
import { VentasService } from '../ventas/ventas.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICliente } from '../interfaces/cliente.interface';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  constructor(private clientesService: ClientesService,
    private ventasService: VentasService,
    private fb: FormBuilder
  ) { }

  clienteModel: FormGroup;
  cliente: ICliente = {};

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.clienteModel = this.fb.group({
      identifiacion: [null]
    });
  }

  resetForm() {
    this.clienteModel.reset();
    this.cliente = {};
  }

  getCliente() {
    if (this.clienteModel.value.identifiacion == null) {
      this.ventasService.openSnackBar("Debe digitar una identificacion", "OK");
    } else {
      this.clientesService.sendGetIdRequest(this.clienteModel.value.identifiacion).subscribe((data: any[]) => {
        // console.log(data);
        if (!data.length) {
          this.ventasService.openSnackBar("No se encontro un cliente con esa identificacion", "OK");
        } else {
          this.cliente = data[0];
          this.clientesService.setCliente(this.cliente);
          this.clienteModel.reset();
        }
        
      });
    }

  }
  
}
