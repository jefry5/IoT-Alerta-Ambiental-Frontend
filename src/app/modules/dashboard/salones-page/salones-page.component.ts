import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SalonesCardComponent } from './components/salones-card/salones-card.component';
import { Aula } from '../../../core/models/aula.model';

@Component({
  selector: 'app-salones-page',
  imports: [SalonesCardComponent, CommonModule],
  templateUrl: './salones-page.component.html',
})
export class SalonesPageComponent implements OnInit {
  aulas: Aula[] = [];

  constructor() { }

  ngOnInit(): void {
    this.aulas = [
      {
        nombre: 'A01',
        ubicacion: 'Edificio A - Piso 1',
        temperatura: 24.5,
        humedad: 60,
        co2_ppm: 1200,
        aforo: 30,
        conteo_personas: 18
      },
      {
        nombre: 'A02',
        ubicacion: 'Edificio B - Piso 2',
        temperatura: 26.1,
        humedad: 58,
        co2_ppm: 1350,
        aforo: 35,
        conteo_personas: 25
      }
    ];
  }
}
