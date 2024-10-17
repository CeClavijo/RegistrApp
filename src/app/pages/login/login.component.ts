import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      tipoUsuario: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const { nombreUsuario, contrasena } = this.loginForm.value;

      // Llama a la API para obtener la lista de usuarios
      this.usuarioService.getUsuarios().subscribe(async (usuarios) => {
        // Busca el usuario que coincida con el nombre de usuario y contraseña
        const usuario = usuarios.find(u => u.nombreUsuario === nombreUsuario && u.password === contrasena);

        if (usuario) {
          // Verifica si es un estudiante y redirige
          if (usuario.tipo === 'estudiante') {
            this.usuarioService.login(); // Llama al método para marcar al usuario como autenticado
            this.router.navigate(['/alumno']); // Redirige al componente Alumno
          } else {
            const toast = await this.toastController.create({
              message: 'Acceso permitido solo para alumnos en este momento.',
              duration: 2000,
              position: 'top'
            });
            await toast.present();
          }
        } else {
          const toast = await this.toastController.create({
            message: 'Usuario no registrado o contraseña incorrecta.',
            duration: 2000,
            position: 'top'
          });
          await toast.present();
        }
      }, async (error) => {
        console.error('Error al obtener usuarios:', error);
        const toast = await this.toastController.create({
          message: 'Error al obtener usuarios.',
          duration: 2000,
          position: 'top'
        });
        await toast.present();
      });
    }
  }
}
