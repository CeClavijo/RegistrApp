import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {
  registrarForm: FormGroup;
  passwordRequirements = [
    { text: 'Mínimo 10 caracteres', met: false },
    { text: 'Una letra mayúscula', met: false },
    { text: 'Una letra minúscula', met: false },
    { text: 'Un número', met: false },
    { text: 'Un carácter especial', met: false }
  ];
  contrasenaTouched: boolean = false;
  correoRepetido: boolean = false; // Para controlar si el correo ya está registrado

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router
  ) {
    this.registrarForm = this.formBuilder.group({
      tipoUsuario: ['', Validators.required],
      nombreUsuario: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, this.passwordValidator.bind(this)]]
    });
  }

  ngOnInit() {
    // Resetear correoRepetido cuando el usuario cambie el valor del campo de email
    this.registrarForm.get('email')?.valueChanges.subscribe(() => {
      this.correoRepetido = false;
    });
  }

  // Validación personalizada de la contraseña
  passwordValidator(control: any) {
    const password = control.value || '';
    const isLengthValid = password.length >= 10;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^\w\s]/.test(password); // Caracter especial

    this.passwordRequirements[0].met = isLengthValid;
    this.passwordRequirements[1].met = hasUppercase;
    this.passwordRequirements[2].met = hasLowercase;
    this.passwordRequirements[3].met = hasNumber;
    this.passwordRequirements[4].met = hasSpecialChar;

    if (!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return { passwordInvalid: true };
    }

    return null; // Todo es válido
  }

  volver() {
    this.router.navigate(['']);
  }

  // Verificar si el correo ya existe en la API
  async checkCorreoExistente(email: string) {
    return new Promise<boolean>((resolve) => {
      this.usuarioService.getUsuarios().subscribe((usuarios) => {
        const correoExistente = usuarios.some((usuario: any) => usuario.email.toLowerCase() === email.toLowerCase());
        resolve(correoExistente);
      });
    });
  }

  async onSubmit() {
    const email = this.registrarForm.value.email.toLowerCase(); // Convertir a minúsculas

    // Verificar si el correo ya está en uso
    const correoExiste = await this.checkCorreoExistente(email);
    if (correoExiste) {
      this.correoRepetido = true;
      const toast = await this.toastController.create({
        message: 'El correo ya está en uso.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // Si el formulario es válido y el correo no está repetido
    if (this.registrarForm.valid) {
      const usuario = {
        tipo: this.registrarForm.value.tipoUsuario,
        nombreUsuario: this.registrarForm.value.nombreUsuario,
        password: this.registrarForm.value.contrasena,
        email: email // Guardar el correo en minúsculas
      };

      this.usuarioService.registrarUsuario(usuario).subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Usuario registrado exitosamente',
            duration: 2000,
            position: 'top'
          });
          await toast.present();
          this.registrarForm.reset(); // Limpiar el formulario tras éxito
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: 'Error al registrar el usuario',
            duration: 2000,
            position: 'top'
          });
          await toast.present();
        }
      );
    }
  }

  checkPasswordRequirements() {
    this.registrarForm.controls['contrasena'].updateValueAndValidity();
  }
}
