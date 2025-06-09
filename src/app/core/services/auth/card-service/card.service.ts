import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CardData } from '../../../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private CARD_KEY: string = 'card';

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  //Método para obtener los datos de la Card
  getCard(): CardData | null {
    if (isPlatformBrowser(this.platformId)) {
      const card = localStorage.getItem(this.CARD_KEY);
      if (card) {
        return JSON.parse(card) as CardData;
      }
    }
    return null;
  }

  //Método para establecer los datos de la Card
  setCard(data: CardData): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CARD_KEY, JSON.stringify(data));
    }
  }

  //Método para actualizar un campo específico de la Card
  updateCardField<K extends keyof CardData>(key: K, value: CardData[K]): void {
    if (isPlatformBrowser(this.platformId)) {
      const card = this.getCard();
      if (card) {
        card[key] = value;
        this.setCard(card);
      }
    }
  }

  //Método para remover los datos de la Card
  removeCard(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CARD_KEY);
    }
  }
}
