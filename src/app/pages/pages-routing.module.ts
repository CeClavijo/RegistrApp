import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { ProfesorComponent } from './profesor/profesor.component'; // Importa tu componente Profesor
import { AuthGuard } from '../guards/auth.guard';
import { ProhibidoComponent } from './prohibido/prohibido.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'alumno', component: AlumnoComponent, canActivate: [AuthGuard] },
  { path: 'profesor', component: ProfesorComponent, canActivate: [AuthGuard] }, // Ruta protegida para profesor
  { path: 'prohibido', component: ProhibidoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesPageRoutingModule {}
