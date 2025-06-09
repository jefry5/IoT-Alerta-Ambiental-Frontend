import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { MenuBarComponent } from './shared/components/menu-bar/menu-bar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [ToastModule ,RouterOutlet, MenuBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  //Variable que controla si nos encontramos en la pagina de autenticación
  isPageAuth: boolean = false;

  constructor(private router: Router, private primeng: PrimeNG) { }

  ngOnInit(): void {
    this.primeng.ripple.set(true);

    //Permite saber si nos encontramos en la ruta '/auth/**' para cambiar el estado de 'isPageAuth'
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.startsWith('/auth')) {
          this.isPageAuth = true;
        } else {
          this.isPageAuth = false;
        }
      });
  }
}
