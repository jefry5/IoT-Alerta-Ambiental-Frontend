import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStateService {
  private _isConnectionError = false;

  get isConnectionError(): boolean {
    return this._isConnectionError;
  }

  setConnectionError(value: boolean) {
    this._isConnectionError = value;
  }
}
