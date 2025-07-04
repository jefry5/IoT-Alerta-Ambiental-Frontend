import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CardService } from '../../../core/services/auth/card-service/card.service';

@Component({
  selector: 'app-menu-bar',
  imports: [
    Menubar,
    ButtonModule,
    ConfirmPopupModule,
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './menu-bar.component.html',
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router, private authService: AuthService, private cardService: CardService) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'fa fa-table-columns',
        items: [
          {
            label: 'Aulas',
            command: () => {
              this.router.navigate(['/dashboard/aulas']);
            },
          },
        ],
      },
      {
        label: this.cardService.getCard()?.usuario,
        icon: 'fa fa-user',
        items: [
          {
            label: 'Cerrar sesión',
            icon: 'fa fa-sign-out',
            command: () => {
              this.salir();
            },
          },
        ],
      },
    ];
  }

  //Método encargado de cerrar sesión en el menu bar
  salir() {
    this.authService.logout();
  }
}
