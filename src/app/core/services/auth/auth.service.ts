import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MessagesService } from '../messages/messages.service';
import { CardService } from './card-service/card.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL_API: string = '';
  public isLogged: boolean = false;

  constructor(private http: HttpClient, private router: Router, private messagesService: MessagesService, private cardService: CardService) {
    this.URL_API = `${environment.apiUrl}/auth`;
  }

  // Método para iniciar sesión
  login(user: string, password: string) {
    return this.http.post(`${this.URL_API}/login`, {
      user: user,
      password: password,
    }, { withCredentials: true });
  }

  // Método para cerrar sesión
  logout() {
    return this.http.post(`${this.URL_API}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.isLogged = false;
        this.cardService.removeCard();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.messagesService.errorMessage(
          'Algo salió mal',
          'No se pudo cerrar la sesión, por favor intentar de nuevo',
        );
      }
    })
  }

  // Método para consultar el estado del cookie en sesión
  getCookieStatus() {
    return this.http.get(`${this.URL_API}/cookie-status`, { withCredentials: true });
  }
}