import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonesChartComponent } from './salones-chart.component';

describe('SalonesChartComponent', () => {
  let component: SalonesChartComponent;
  let fixture: ComponentFixture<SalonesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
