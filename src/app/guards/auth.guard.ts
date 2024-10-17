import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.usuarioService.isLoggedIn();

    if (!isAuthenticated) {
      // Redirige a la página de Prohibido si no está autenticado
      this.router.navigate(['/prohibido']); // Asegúrate de que esta ruta esté configurada
      return false; // Bloquea la navegación
    }

    return true; // Permite la navegación
  }
}

