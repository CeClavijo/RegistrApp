import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, ToastController } from '@ionic/angular';
import QRious from 'qrious';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.scss'],
})
export class ProfesorComponent implements OnInit {
  usuario: string = ''; // Campo para almacenar el nombre del usuario
  asignaturas = [
    { nombre: 'Programación en Python', id: 'INF101' },
    { nombre: 'Bases de Datos', id: 'INF102' },
    { nombre: 'Algoritmos y Estructuras de Datos', id: 'INF103' },
  ];

  qrData: string = ''; // Almacena los datos del QR
  showQRCode: boolean = false; // Controla la visibilidad del código QR

  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>; // Referencia al canvas

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController // Agregamos el ToastController
  ) {}

  ngOnInit() {
    // Obtener el usuario autenticado
    const usuarioActual = this.usuarioService.getUsuarioActual();
    this.usuario = usuarioActual ? usuarioActual.nombreUsuario : ''; // Almacena el nombre de usuario
  }

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

  generarQR(asignaturaId: string) {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const día = String(fechaActual.getDate()).padStart(2, '0');
    const horas = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');

    const fechaHora = `${año}-${mes}-${día},${horas}:${minutos}:${segundos}`;
    this.qrData = `http://localhost:8100/asistencia/${asignaturaId}/${this.usuario}/${fechaHora}`;

    this.showQRCode = true; // Muestra el código QR

    // Utiliza setTimeout para esperar un momento antes de crear el QR
    setTimeout(() => {
      this.createQR(); // Genera el código QR
    }, 0);
  }

  createQR() {
    const qr = new QRious({
      element: this.qrCanvas.nativeElement,
      value: this.qrData,
      size: 256,
      level: 'M'
    });
  }

  async presentConfirmAttendanceAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres confirmar la asistencia?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.showQRCode = false; // Oculta el código QR
            this.presentToast();
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Asistencia no confirmada');
          },
        },
      ],
    });

    await alert.present();
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Asistencia confirmada',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }
}
