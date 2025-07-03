import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ChartAula } from '../../../../../../../core/models/chartAula.model';
import { ChartModule } from 'primeng/chart';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { interval, Subscription, switchMap } from 'rxjs';
import { DashboardService } from '../../../../../../../core/services/dashboard/dashboard.service';
import { MessagesService } from '../../../../../../../core/services/messages/messages.service';

@Component({
  selector: 'app-salones-chart',
  imports: [DialogModule, ChartModule, ToggleSwitchModule, FormsModule, CommonModule],
  templateUrl: './salones-chart.component.html',
})
export class SalonesChartComponent implements OnInit, OnDestroy {
  @Input() aulaName: string = '';
  @Input() aulaAforo: number = -1;
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  checked: boolean = false;
  pollingSub!: Subscription;

  // Datos de los gráficos en el HTML
  @ViewChild('chartTemp') chartTemp!: any;
  @ViewChild('chartHum') chartHum!: any;
  @ViewChild('chartCo2') chartCo2!: any;
  @ViewChild('chartNo2') chartNo2!: any;
  @ViewChild('chartNh3') chartNh3!: any;
  @ViewChild('lineTemp') lineTemp!: any;
  @ViewChild('lineHum') lineHum!: any;
  @ViewChild('lineCo2') lineCo2!: any;
  @ViewChild('lineNo2') lineNo2!: any;
  @ViewChild('lineNh3') lineNh3!: any;


  // Datos de la gráfica por tipo de variable para scatter
  scatterTempData: any;
  scatterHumData: any;
  scatterCo2Data: any;
  scatterNo2Data: any;
  scatterNh3Data: any;

  // Datos de la gráfica por tipo de variable para line
  lineTempData: any;
  lineHumData: any;
  lineCo2Data: any;
  lineNo2Data: any;
  lineNh3Data: any;

  scatterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  constructor(private dashboardService: DashboardService, private messagesService: MessagesService) { }

  ngOnInit(): void {
    // Inicializa las gráficas
    this.initCharts();

    // Realizamos la primera consulta apenas iniciar
    this.firstGraphUpdate();

    // Empieza a consultar en tiempo real cada cierto tiempo
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }

  onToggleSwitchChange(event: any): void {
    const isChecked = event.checked;

    // Reinicia los gráficos
    this.initCharts();

    // Decide según el toggle switch
    if (isChecked) {
      this.stopRealTimeUpdates();
      this.loadHistoricalData();
    } else {
      this.firstGraphUpdate();
      this.startRealTimeUpdates();
    }
  }

  private initCharts(): void {
    const baseLine = () => ({ labels: [], datasets: [{ data: [], borderColor: '', label: '', fill: false }] });
    const baseScatter = () => ({ datasets: [{ data: [], backgroundColor: '', label: '' }] });

    this.scatterTempData = baseScatter();
    this.scatterTempData.datasets[0].label = 'Conteo vs Temperatura';
    this.scatterTempData.datasets[0].backgroundColor = '#42A5F5';

    this.scatterHumData = baseScatter();
    this.scatterHumData.datasets[0].label = 'Conteo vs Humedad';
    this.scatterHumData.datasets[0].backgroundColor = '#66BB6A';

    this.scatterCo2Data = baseScatter();
    this.scatterCo2Data.datasets[0].label = 'Conteo vs CO2';
    this.scatterCo2Data.datasets[0].backgroundColor = '#FF7043';

    this.scatterNo2Data = baseScatter();
    this.scatterNo2Data.datasets[0].label = 'Conteo vs NO2';
    this.scatterNo2Data.datasets[0].backgroundColor = '#FF7043';

    this.scatterNh3Data = baseScatter();
    this.scatterNh3Data.datasets[0].label = 'Conteo vs NH3';
    this.scatterNh3Data.datasets[0].backgroundColor = '#FF7043';

    this.lineTempData = baseLine();
    this.lineTempData.datasets[0].label = 'Temperatura';
    this.lineTempData.datasets[0].borderColor = '#42A5F5';

    this.lineHumData = baseLine();
    this.lineHumData.datasets[0].label = 'Humedad';
    this.lineHumData.datasets[0].borderColor = '#66BB6A';

    this.lineCo2Data = baseLine();
    this.lineCo2Data.datasets[0].label = 'CO2 (ppm)';
    this.lineCo2Data.datasets[0].borderColor = '#FF7043';

    this.lineNo2Data = baseLine();
    this.lineNo2Data.datasets[0].label = 'NO2 (ppm)';
    this.lineNo2Data.datasets[0].borderColor = '#FF7043';

    this.lineNh3Data = baseLine();
    this.lineNh3Data.datasets[0].label = 'NH3 (ppm)';
    this.lineNh3Data.datasets[0].borderColor = '#FF7043';
  }

  private firstGraphUpdate(): void {
    this.dashboardService.getLastChartData(this.aulaName).subscribe({
      next: (res: any) => {
        const data: ChartAula = res.data;
        if (!data) return;
        this.updatePointOnGraphics(data);
      },
      error: () => {
        this.messagesService.errorMessage(
          'Error al cargar',
          `No se pudo cargar los datos del aula ${this.aulaName}. Por favor, inténtalo de nuevo más tarde`,
        );
      }
    })
  }

  private startRealTimeUpdates(): void {
    this.pollingSub = interval(10000).pipe(
      switchMap(() => this.dashboardService.getLastChartData(this.aulaName))
    ).subscribe({
      next: (res: any) => {
        const data: ChartAula = res.data
        if (!data) return;
        this.updatePointOnGraphics(data);
      },
      error: () => {
        this.messagesService.errorMessage(
          'Error al cargar',
          `No se pudo cargar los datos del aula ${this.aulaName}. Por favor, inténtalo de nuevo más tarde`,
        );
      }
    });
  }

  private loadHistoricalData(): void {
    this.dashboardService.getAllChartData(this.aulaName).subscribe({
      next: (res: any) => {
        const dataList: ChartAula[] = res.data;
        if (!dataList || dataList.length === 0) return;

        // Reinicia los gráficos
        this.initCharts();

        // Coloca el punto para cada elemento de la lista
        dataList.forEach((data) => this.updatePointOnGraphics(data))
      }
    })
  }

  private updatePointOnGraphics(data: ChartAula): void {
    const { temperatura, humedad, co2_ppm, no2_ppm, nh3_ppm, createdAt, cantidad } = data;
    const hora = new Date(createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.addScatterPoint(this.scatterTempData, this.chartTemp, cantidad, temperatura);
    this.addScatterPoint(this.scatterHumData, this.chartHum, cantidad, humedad);
    this.addScatterPoint(this.scatterCo2Data, this.chartCo2, cantidad, co2_ppm);
    this.addScatterPoint(this.scatterNo2Data, this.chartNo2, cantidad, no2_ppm);
    this.addScatterPoint(this.scatterNh3Data, this.chartNh3, cantidad, nh3_ppm);

    this.addLinePoint(this.lineTempData, this.lineTemp, hora, temperatura);
    this.addLinePoint(this.lineHumData, this.lineHum, hora, humedad);
    this.addLinePoint(this.lineCo2Data, this.lineCo2, hora, co2_ppm);
    this.addLinePoint(this.lineNo2Data, this.lineNo2, hora, no2_ppm);
    this.addLinePoint(this.lineNh3Data, this.lineNh3, hora, nh3_ppm);
  }

  private addScatterPoint(chartData: any, chartRef: any, x: number, y: number): void {
    chartData.datasets[0].data.push({ x, y });
    if (chartData.datasets[0].data.length > 10) chartData.datasets[0].data.shift();
    chartRef.refresh();
  }

  private addLinePoint(chartData: any, chartRef: any, label: string, value: number): void {
    chartData.labels.push(label);
    chartData.datasets[0].data.push(value);
    if (chartData.labels.length > 10) {
      chartData.labels.shift();
      chartData.datasets[0].data.shift();
    }
    chartRef.refresh();
  }

  private stopRealTimeUpdates(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined!;
    }
  }

  cerrarDialogo(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
    this.cerrar.emit();
  }
}