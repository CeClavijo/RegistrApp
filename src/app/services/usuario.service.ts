import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://670832fb8e86a8d9e42e558b.mockapi.io/usuario';
  private loggedIn = false; // Define loggedIn aquí
  private usuarioActual: any; // Almacena el usuario autenticado

  constructor(private http: HttpClient) { }

  // Método para obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para registrar usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // Método para iniciar sesión
  login(usuario: any) {
    this.loggedIn = true; // Cambia el estado a autenticado
    this.usuarioActual = usuario; // Almacena el usuario autenticado
  }

  // Método para obtener el nombre de usuario del usuario autenticado
  getNombreUsuario(): string {
    return this.usuarioActual ? this.usuarioActual.nombreUsuario : ''; // Retorna el nombre de usuario
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.loggedIn; // Devuelve el estado de autenticación
  }

  // Método para cerrar sesión
  logout() {
    this.loggedIn = false; // Cambia el estado a no autenticado
    this.usuarioActual = null; // Resetea el usuario actual
  }
}
