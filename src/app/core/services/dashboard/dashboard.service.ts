import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private URL_API: string = '';

  constructor(private http: HttpClient) {
    this.URL_API = `${environment.apiUrl}/dashboard`;
  }

  // Método para obtener los datos de los sensores
  getSensorData() {
    return this.http.get(`${this.URL_API}/data`, { withCredentials: true });
  }

  // Método para accionar en uno de los salones
  emitAlert(salon: string) {
    this.http.post(`${this.URL_API}/alert`, {
      salon: salon,
    }, { withCredentials: true });
  }

  // Método para obentener las métricas de uno de los salones
  getMetricData(salon: string) {
    const params = new HttpParams().set('salon', salon);
    return this.http.get(`${this.URL_API}/metric`, { params, withCredentials: true });
  }
}