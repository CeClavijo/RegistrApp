import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class AlumnoComponent {
  public alertButtons = [
    {
      text: 'Sí',
      role: 'confirm',
      handler: () => {
        this.logout(); // Llama a la función de cierre de sesión
      },
    },
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
  ];

  nombreUsuario: string; // Agrega esta línea para almacenar el nombre de usuario
  listaAsistencias: any[]; // Arreglo para almacenar la lista de asistencias

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.nombreUsuario = this.usuarioService.getNombreUsuario(); // Asigna el nombre de usuario desde el servicio

    // Inicializa la lista de asistencias
    this.listaAsistencias = [
      { nombre: 'Arquitectura', totalClases: 18, asistencias: 18, porcentajeAsistencia: 100 },
      { nombre: 'Calidad de Software', totalClases: 9, asistencias: 6, porcentajeAsistencia: 88.9 },
      { nombre: 'Programación de Aplicaciones Móviles', totalClases: 17, asistencias: 15, porcentajeAsistencia: 88.2 }
    ];
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Desea cerrar su sesión?',
      buttons: this.alertButtons
    });
    await alert.present();
  }

  logout() {
    this.usuarioService.logout(); // Cierra sesión
    this.router.navigate(['']); // Redirige al login
  }

  setResult(ev) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
}
