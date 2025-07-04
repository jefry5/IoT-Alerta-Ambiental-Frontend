import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlugService {
  private URL_API: string = '';

  constructor(private http: HttpClient) {
    this.URL_API = `${environment.apiUrl}/plug`;
  }

  //Método para encender el enchufe
  emitPlugOn() {
    return this.http.post(`${this.URL_API}/on`, {}, { withCredentials: true });
  }

  //Método para apagar el enchufe
  emitPlugOff() {
    return this.http.post(`${this.URL_API}/off`, {}, { withCredentials: true });
  }
}