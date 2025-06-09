import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private KEY: string = 'br'; //Llave de posición del cuadro de mensaje (Para mas información: https://primeng.org/toast)
  private TIME_DURATION: number = 4000; //Unidad de tiempo(ms)

  constructor(private messageService: MessageService) { }

  //Metodo para colocar un mensaje de exito emergente en la esquina inferior derecha
  successMessage(titulo: string, mensaje: string) {
    this.messageFormat('success', titulo, mensaje);
  }

  //Metodo para colocar un mensaje de información emergente en la esquina inferior derecha
  infoMessage(titulo: string, mensaje: string) {
    this.messageFormat('info', titulo, mensaje);
  }

  //Metodo para colocar un mensaje de advertencia emergente en la esquina inferior derecha
  warningMessage(titulo: string, mensaje: string) {
    this.messageFormat('warn', titulo, mensaje);
  }

  //Metodo para colocar un mensaje de error emergente en la esquina inferior derecha
  errorMessage(titulo: string, mensaje: string) {
    this.messageFormat('error', titulo, mensaje);
  }

  //Metodo para colocar un mensaje de contraste emergente en la esquina inferior derecha
  contrastMessage(titulo: string, mensaje: string) {
    this.messageFormat('contrast', titulo, mensaje);
  }

  //Metodo para colocar un mensaje secundario emergente en la esquina inferior derecha
  secondarMessage(titulo: string, mensaje: string) {
    this.messageFormat('secondary', titulo, mensaje);
  }

  //Metodo que presenta el formato para el servicio de mensajes emergentes
  private messageFormat(severity: string, titulo: string, mensaje: string) {
    this.messageService.add({
      severity: severity,
      summary: titulo,
      detail: mensaje,
      key: this.KEY,
      life: this.TIME_DURATION,
    });
  }
}
