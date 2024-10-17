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

  ngOnInit() {}

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

  async onSubmit() {
    if (this.registrarForm.valid) {
      const usuario = {
        tipo: this.registrarForm.value.tipoUsuario,
        nombreUsuario: this.registrarForm.value.nombreUsuario,
        password: this.registrarForm.value.contrasena,
        email: this.registrarForm.value.email
      };

      this.usuarioService.registrarUsuario(usuario).subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Usuario registrado exitosamente',
            duration: 2000,
            position: 'top'
          });
          await toast.present();
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
