import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Aula } from '../../models/aula.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private URL_API: string = '';

  constructor(private http: HttpClient) {
    this.URL_API = `${environment.apiUrl}/sensor`;
  }

  // Método para obtener los datos de los sensores
  getSensorData(aulaName: string) {
    const params = new HttpParams().set('aulaName', aulaName);
    return this.http.get(`${this.URL_API}/data`, { params, withCredentials: true });
  }

  // Método para obtener el último dato de las ultimos horas de un aula
  getLastChartData(aulaName: string) {
    const params = new HttpParams().set('aulaName', aulaName);
    return this.http.get(`${this.URL_API}/chart-data-last`, { params, withCredentials: true });
  }

  // Método para obtener todos los datos de las ultimas horas de un aula
  getAllChartData(aulaName: string) {
    const params = new HttpParams().set('aulaName', aulaName);
    return this.http.get(`${this.URL_API}/chart-data-all`, { params, withCredentials: true });
  }

  // Método para rellenar los datos del aula
  fillAulaData(resp: any): Aula {
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