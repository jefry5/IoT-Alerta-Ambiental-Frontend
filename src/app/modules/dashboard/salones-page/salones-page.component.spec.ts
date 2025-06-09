import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonesPageComponent } from './salones-page.component';

describe('SalonesPageComponent', () => {
  let component: SalonesPageComponent;
  let fixture: ComponentFixture<SalonesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
