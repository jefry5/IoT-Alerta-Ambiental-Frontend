import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Aula } from '../../../../../core/models/aula.model';
import { DashboardService } from '../../../../../core/services/dashboard/dashboard.service';
import { MessagesService } from '../../../../../core/services/messages/messages.service';
import { ChartAula } from '../../../../../core/models/chartAula.model';

@Component({
  selector: 'app-salones-card',
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './salones-card.component.html',
})
export class SalonesCardComponent {
  @Input()
  aula!: Aula;

  constructor(private dashboardService: DashboardService, private messagesService: MessagesService) { }

  verMetricas(aula: Aula): void {
    this.dashboardService.getMetricData(aula.nombre).subscribe({
      next: (resp: any) => {
        const aulaChart: ChartAula[] = this.fillCharAulaData(resp);
        console.log(aulaChart);
      },
      error: () => {
        this.messagesService.errorMessage(
          'Error al cargar',
          `No se pudo cargar el aula ${aula.nombre}. Por favor, inténtalo de nuevo más tarde`,
        );
      }
    })
  }

  accionar(aula: Aula): void {
    // lógica para accionar (encender ventilación, alarma, etc.)
    console.log('Accionar en', aula.nombre);
  }

  // Método para rellenar los datos de la gráfica
  private fillCharAulaData(resp: any): ChartAula[] {
    const data = resp.data;

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      temperatura: item.temperatura,
      humedad: item.humedad,
      co2_ppm: item.co2_ppm,
      createdAt: item.createdAt,
    }));
  }
}