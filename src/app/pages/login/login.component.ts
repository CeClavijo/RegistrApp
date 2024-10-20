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
      tipoUsuario: ['', Validators.required], // Se espera 'Alumno' o 'Profesor'
      email: ['', [Validators.required, Validators.email]], // Cambiado a email
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, contrasena, tipoUsuario } = this.loginForm.value;

      // Llama a la API para obtener la lista de usuarios
      this.usuarioService.getUsuarios().subscribe(async (usuarios) => {
        // Busca el usuario que coincida con el correo y contraseña
        const usuario = usuarios.find(u => u.email === email && u.password === contrasena); // Cambiado a email

        if (usuario) {
          // Verifica si el tipo de usuario coincide con el tipo en la base de datos
          if (usuario.tipo === tipoUsuario) {
            // Almacena el usuario autenticado en el servicio
            this.usuarioService.login(usuario);

            // Redirige según el tipo de usuario
            if (usuario.tipo === 'Alumno') {
              this.router.navigate(['/alumno']); // Redirige al componente Alumno
            } else if (usuario.tipo === 'Profesor') {
              this.router.navigate(['/profesor']); // Redirige al componente Profesor
            }
          } else {
            // Muestra un mensaje si el tipo no coincide
            const toast = await this.toastController.create({
              message: 'Tipo de usuario incorrecto.',
              duration: 2000,
              position: 'top',
              color: 'danger'
            });
            await toast.present();
          }
        } else {
          const toast = await this.toastController.create({
            message: 'Usuario no registrado o contraseña incorrecta.',
            duration: 2000,
            position: 'top',
            color: 'danger'
          });
          await toast.present();
        }
      }, async (error) => {
        console.error('Error al obtener usuarios:', error);
        const toast = await this.toastController.create({
          message: 'Error al obtener usuarios.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      });
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }
}
