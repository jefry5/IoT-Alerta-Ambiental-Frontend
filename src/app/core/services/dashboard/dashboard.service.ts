import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  // Método para accionar en uno de los salones
  emitAlert(aulaName: string) {
    this.http.post(`${this.URL_API}/alert`, {
      aula: aulaName,
    }, { withCredentials: true });
  }

  // Método para obentener las métricas de uno de los salones
  getMetricData(aulaName: string) {
    const params = new HttpParams().set('aulaName', aulaName);
    return this.http.get(`${this.URL_API}/data-all`, { params, withCredentials: true });
  }
}