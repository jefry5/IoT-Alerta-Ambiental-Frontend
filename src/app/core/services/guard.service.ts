import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  //Resuelve el estado de la cookie según el guard
  resolveCookieStatus() {
    this.authService.getCookieStatus().subscribe({
      next: () => {
        this.authService.isLogged = true;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.authService.isLogged = false;
        const currentUrl = this.router.url;
        if (!currentUrl.startsWith('/auth')) {
          this.authService.logout();
        }
      },
    });
  }
}