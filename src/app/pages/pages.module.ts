import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Agrega ReactiveFormsModule
import { PagesPageRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { ProhibidoComponent } from './prohibido/prohibido.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule, // Asegúrate de importar ReactiveFormsModule
    PagesPageRoutingModule,
    IonicModule
  ],
  declarations: [LoginComponent, RegistrarComponent, AlumnoComponent, ProhibidoComponent],
})
export class PagesPageModule {}
