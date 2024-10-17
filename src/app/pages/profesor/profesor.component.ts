import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.scss'],
})
export class ProfesorComponent {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController
  ) {}

  public alertButtons = [
    {
      text: 'Sí',
      role: 'confirm',
      handler: () => {
        this.logout();
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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Desea cerrar su sesión?',
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(['']);
  }
}

