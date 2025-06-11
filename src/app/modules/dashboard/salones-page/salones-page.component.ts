import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SalonesCardComponent } from './components/salones-card/salones-card.component';
import { Aula } from '../../../core/models/aula.model';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AULAS_REGISTRADAS } from '../../../core/constants/aula.constant';
import { MessagesService } from '../../../core/services/messages/messages.service';

@Component({
  selector: 'app-salones-page',
  imports: [SalonesCardComponent, CommonModule],
  templateUrl: './salones-page.component.html',
})
export class SalonesPageComponent implements OnInit {
  aulas: Aula[] = [];

  constructor(private dashboardService: DashboardService, private messagesService: MessagesService) { }

  ngOnInit(): void {
    AULAS_REGISTRADAS.forEach(aulaName => {
      this.dashboardService.getSensorData(aulaName).subscribe({
        next: (resp: any) => {
          const aula: Aula = this.fillAulaData(resp);
          this.aulas.push(aula);
        },
        error: () => {
          this.messagesService.errorMessage(
            'Error al cargar',
            `No se pudo cargar el aula ${aulaName}. Por favor, inténtalo de nuevo más tarde`,
          );
        }
      })
    })
  }

  // Método para rellenar los datos del aula
  private fillAulaData(resp: any): Aula {
    const data = resp.data;
    const aula = data.aula;

    return {
      nombre: aula.nombre,
      ubicacion: aula.ubicacion,
      aforo: aula.aforo,
      temperatura: data.temperatura,
      humedad: data.humedad,
      co2_ppm: data.co2_ppm,
      createdAt: data.createdAt,
      conteo_personas: aula.conteo_personas,
    }
  }
}
