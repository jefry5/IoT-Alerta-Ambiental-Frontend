import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonesCardComponent } from './salones-card.component';

describe('SalonesCardComponent', () => {
  let component: SalonesCardComponent;
  let fixture: ComponentFixture<SalonesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
