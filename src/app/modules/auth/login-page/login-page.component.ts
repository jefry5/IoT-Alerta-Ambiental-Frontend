import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { MessagesService } from '../../../core/services/messages/messages.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ConnectionStateService } from '../../../core/services/connection/connection-state.service';
import { finalize } from 'rxjs';
import { CardService } from '../../../core/services/auth/card-service/card.service';

@Component({
  selector: 'app-login-page',
  imports: [
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    CommonModule,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private messagesService: MessagesService,
    private authService: AuthService,
    private router: Router,
    private connectionService: ConnectionStateService,
    private cardService: CardService
  ) { }

  // Define el formulario del login para obtener los datos enviados mediante el submit
  loginForm = new FormGroup({
    usuario: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  // Método que se ejecuta mediante el submit
  logIn(): void {
    if (this.loginForm.valid) {
      const usuario = this.loginForm.controls['usuario'].value!.trim();
      const password = this.loginForm.controls['password'].value!.trim();

      this.isLoading = true;

      this.authService.login(usuario, password)
        .pipe(
          finalize(() => {
            //Finaliza el proceso de carga al terminar la petición
            this.isLoading = false;
          })
        ).subscribe({
          next: (resp: any) => {
            this.cardService.setCard(resp);
            this.authService.isLogged = true;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            if (!this.connectionService.isConnectionError) {
              this.messagesService.errorMessage(
                'Credenciales incorrectas',
                'El usuario y/o contraseña que ingresaste son incorrectos. Por favor, verifica tus datos e inténtalo de nuevo',
              );
            }
          }
        })
    } else {
      this.messagesService.warningMessage(
        'Campos requeridos',
        'Por favor, verifique y complete todos los campos obligatorios antes de continuar',
      );
    }
  }
}