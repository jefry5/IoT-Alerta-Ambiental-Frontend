import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessagesService } from '../../services/messages/messages.service';
import { inject } from '@angular/core';
import { ConnectionStateService } from '../../services/connection/connection-state.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messagesService = inject(MessagesService);
  const connectionState = inject(ConnectionStateService);

  // Al inicio de la petición, limpiamos el estado de error
  connectionState.setConnectionError(false);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (true) {
        case error.status === 0:
          connectionState.setConnectionError(true);
          messagesService.errorMessage(
            'Sin conexión',
            'No se pudo establecer conexión con el servidor. Por favor, inténtelo de nuevo más tarde.'
          );
          break;
        
        case error.status !== 404 && error.status !== 403 && error.status !== 200 && error.status !== 400 && error.status !== 401:
          messagesService.errorMessage(
            'Error inesperado',
            'Ocurrió un error inesperado en el servidor. Por favor, inténtelo de nuevo más tarde.'
          );
          break;
      }

      return throwError(() => error);
    })
  );
};
