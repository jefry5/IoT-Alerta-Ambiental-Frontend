import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Aula } from '../../../../../core/models/aula.model';
import { MessagesService } from '../../../../../core/services/messages/messages.service';
import { ChartAula } from '../../../../../core/models/chartAula.model';
import { PlugService } from '../../../../../core/services/dashboard/plug.service';
import { PopoverModule } from 'primeng/popover';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { SalonesChartComponent } from './components/salones-chart/salones-chart.component';
import { interval, Subscription, switchMap } from 'rxjs';
import { DashboardService } from '../../../../../core/services/dashboard/dashboard.service';
import { TagModule } from 'primeng/tag';
import { Diagnostic } from '../../../../../core/models/diagnostic.model';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-salones-card',
  imports: [CardModule, ButtonModule, PopoverModule, ToggleSwitchModule, FormsModule, SalonesChartComponent, TagModule, DialogModule, CommonModule],
  templateUrl: './salones-card.component.html',
})
export class SalonesCardComponent implements OnInit {
  @Input()
  aula!: Aula;
  pollingSub!: Subscription;

  checkedPlug: boolean = false;
  dataAulaSeleccionada!: ChartAula[];
  mostrarDialogo: boolean = false;

  diagnostico: string = '';
  recomendaciones: string[] = [];
  dispositivosAActivar: string[] = [];
  titlecase: string = 'leve';

  cargandoDiagnostico: boolean = false;
  mostrarDialogoDiagnostico: boolean = false;

  constructor(private dashboardService: DashboardService, private plugService: PlugService, private messagesService: MessagesService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // Primera consulta a realizar
    this.getLastAulaData();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.updateRealTimeAulaData());
    }
  }

  // Define el estado del aula según los datos recibidos
  getEstadoSeverity(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'leve':
        return 'success';
      case 'moderado':
        return 'warning';
      case 'crítico':
        return 'danger';
      default:
        return 'info';
    }
  }

  private getLastAulaData(): void {
    this.dashboardService.getSensorData(this.aula.nombre).subscribe({
      next: (res: any) => {
        this.aula = this.dashboardService.fillAulaData(res);
        if (this.aula.estado === 'leve' || this.aula.estado === 'moderado') {
          this.controlarEnchufe(false);
        }
        if (this.aula.estado === 'crítico') {
          this.controlarEnchufe(true);
        }
      },
      error: () => {
        this.messagesService.errorMessage(
          'Error al cargar datos del aula',
          `No se pudo obtener los datos del aula ${this.aula.nombre}`,
        );
      }
    })
  }

  private updateRealTimeAulaData(): void {
    this.pollingSub = interval(30000)
      .pipe(switchMap(() => this.dashboardService.getSensorData(this.aula.nombre)))
      .subscribe({
        next: (res: any) => {
          this.aula = this.dashboardService.fillAulaData(res);
          if (this.aula.estado === 'leve' || this.aula.estado === 'moderado') {
            this.controlarEnchufe(false);
          }
          if (this.aula.estado === 'crítico') {
            this.controlarEnchufe(true);
          }
        },
        error: () => {
          this.messagesService.errorMessage(
            'Error al cargar datos del aula',
            `No se pudo obtener los datos del aula ${this.aula.nombre}`,
          );
        }
      });
  }

  verMetricas(): void {
    this.mostrarDialogo = true;
  }

  // Método para consultar sobre el diagnóstico del aula
  accionDianostico(): void {
    this.cargandoDiagnostico = true;

    this.dashboardService.getDiagnostico(this.aula.nombre).subscribe({
      next: (res: any) => {
        const data: Diagnostic = res.data;
        const { diagnostico, recomendaciones, dispositivos } = data;
        this.diagnostico = diagnostico;
        this.recomendaciones = recomendaciones;
        this.dispositivosAActivar = dispositivos;

        if (this.dispositivosAActivar.length > 0) {
          this.ejecutarAccionesDispositivos();
          this.messagesService.successMessage(
            'Acción ejecutada',
            'Se mandó la acción para activar los dispositivos necesarios.',
          );
        } else {
          this.messagesService.infoMessage(
            'Sin acción necesaria',
            'No se requiere activar ningún dispositivo.'
          );
        }
        this.cargandoDiagnostico = false;
      },
      error: () => {
        this.diagnostico = '';
        this.recomendaciones = [];
        this.dispositivosAActivar = [];
        this.messagesService.errorMessage(
          'Error al cargar diagnóstico',
          `No se pudo obtener el diagnostico en el aula ${this.aula.nombre}`,
        );
        this.cargandoDiagnostico = false;
      },
    });
  }

  ejecutarAccionesDispositivos(): void {
    for (const dispositivo of this.dispositivosAActivar) {
      switch (dispositivo.toLowerCase()) {
        case 'enchufe':
          this.controlarEnchufe(true); // Encender enchufe
          break;
        default:
          console.warn(`⚠️ Dispositivo no reconocido: ${dispositivo}`);
          break;
      }
    }
  }

  private controlarEnchufe(encender: boolean): void {
    if (encender) {
      this.encenderEnchufe();
    } else {
      this.apagarEnchufe();
    }
  }

  onTogglePlugChange(event: any): void {
    if (this.checkedPlug) {
      this.encenderEnchufe();
    } else {
      this.apagarEnchufe();
    }
  }

  private encenderEnchufe(): void {
    // lógica para accionar (encender ventilación, alarma, etc.)
    this.plugService.emitPlugOn().subscribe({
      next: (resp: any) => {
        if (resp.status === 'on'){
          this.checkedPlug = true;
          return;
        }

        const result = resp.result;
        if (result.success) {
          this.checkedPlug = true;
          this.messagesService.successMessage(
            'Enchufe encendido',
            `El enchufe para el aula ${this.aula.nombre} se encendió correctamente.`,
          );
        } else {
          this.checkedPlug = false;
          this.messagesService.errorMessage(
            'Error al encender enchufe',
            `No se pudo encender el enchufe en el aula ${this.aula.nombre}`,
          );
        }
      },
      error: () => {
        this.checkedPlug = false;
        this.messagesService.errorMessage(
          'Algo salió mal',
          `No se pudo comunicar con el enchufe en el aula ${this.aula.nombre}`,
        );
      }
    })
  }

  private apagarEnchufe(): void {
    // lógica para apagar el enchufe
    this.plugService.emitPlugOff().subscribe({
      next: (resp: any) => {
        if ( resp.status === 'off'){
          this.checkedPlug = false;
          return;
        }

        const result = resp.result;
        if (result.success) {
          this.checkedPlug = false;
          this.messagesService.successMessage(
            'Enchufe apagado',
            `El enchufe para el aula ${this.aula.nombre} se apagó correctamente.`,
          );
        } else {
          this.checkedPlug = true;
          this.messagesService.errorMessage(
            'Error al apagar enchufe',
            `No se pudo apagar el enchufe en el aula ${this.aula.nombre}`,
          );
        }
      },
      error: () => {
        this.checkedPlug = true;
        this.messagesService.errorMessage(
          'Algo salió mal',
          `No se pudo comunicar con el enchufe en el aula ${this.aula.nombre}`,
        );
      }
    })
  }
}