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

@Component({
  selector: 'app-salones-card',
  imports: [CardModule, ButtonModule, PopoverModule, ToggleSwitchModule, FormsModule, SalonesChartComponent, CommonModule],
  templateUrl: './salones-card.component.html',
})
export class SalonesCardComponent implements OnInit {
  @Input()
  aula!: Aula;
  pollingSub!: Subscription;

  checkedPlug: boolean = false;
  dataAulaSeleccionada!: ChartAula[];
  mostrarDialogo: boolean = false;

  recomendaciones: string[] = [
    'El CO₂ supera el umbral recomendado.',
    'Temperatura por encima de 28 °C.',
    'Humedad fuera del rango ideal (40%-60%).'
  ];

  constructor(private dashboardService: DashboardService, private plugService: PlugService, private messagesService: MessagesService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    // Primera consulta a realizar
    this.getLastAulaData();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.updateRealTimeAulaData());
    }
  }

  private getLastAulaData(): void {
    this.dashboardService.getSensorData(this.aula.nombre).subscribe({
      next: (res: any) => {
        this.aula = this.dashboardService.fillAulaData(res) || {};
      },
      error: () => {

      }
    })
  }

  private updateRealTimeAulaData(): void {
    this.pollingSub = interval(30000)
      .pipe(switchMap(() => this.dashboardService.getSensorData(this.aula.nombre)))
      .subscribe({
        next: (res: any) => this.aula = this.dashboardService.fillAulaData(res) || {},
        error: () => { }
      });
  }

  verMetricas(): void {
    this.mostrarDialogo = true;
  }

  tomarAccionDianostico(): void {
    this.messagesService.successMessage(
      'Acción realizada',
      'La acción se ha realizado exitosamente.'
    );
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
        const result = resp.result;
        if (result.success) {
          this.messagesService.successMessage(
            'Enchufe encendido',
            `El enchufe para el aula ${this.aula.nombre} se encendió correctamente.`,
          );
        } else {
          this.messagesService.errorMessage(
            'Error al encender enchufe',
            `No se pudo encender el enchufe en el aula ${this.aula.nombre}`,
          );
        }
      },
      error: () => {
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
        const result = resp.result;
        if (result.success) {
          this.messagesService.successMessage(
            'Enchufe apagado',
            `El enchufe para el aula ${this.aula.nombre} se apagó correctamente.`,
          );
        } else {
          this.messagesService.errorMessage(
            'Error al apagar enchufe',
            `No se pudo apagar el enchufe en el aula ${this.aula.nombre}`,
          );
        }
      },
      error: () => {
        this.messagesService.errorMessage(
          'Algo salió mal',
          `No se pudo comunicar con el enchufe en el aula ${this.aula.nombre}`,
        );
      }
    })
  }
}