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
    this.aulas = [];

    AULAS_REGISTRADAS.forEach(aulaName => {
      this.dashboardService.getSensorData(aulaName).subscribe({
        next: (resp: any) => {
          const aula: Aula = this.dashboardService.fillAulaData(resp);
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
}
