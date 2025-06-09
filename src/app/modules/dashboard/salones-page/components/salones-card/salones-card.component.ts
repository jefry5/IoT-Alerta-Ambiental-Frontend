import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salones-card',
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './salones-card.component.html',
})
export class SalonesCardComponent {
  @Input()
  aula!: {
    nombre: string;
    ubicacion: string;
    temperatura: number;
    humedad: number;
    co2_ppm: number;
    aforo: number;
    conteo_personas: number;
  };

  verMetricas(aula: any) {
    // lógica para ver métricas (navegación, modal, etc.)
    console.log('Ver métricas de', aula.nombre);
  }

  accionar(aula: any) {
    // lógica para accionar (encender ventilación, alarma, etc.)
    console.log('Accionar en', aula.nombre);
  }
}
