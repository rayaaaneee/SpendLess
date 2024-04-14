import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendComponent } from './spend.component';

describe('SpendComponent', () => {
  let component: SpendComponent;
  let fixture: ComponentFixture<SpendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return substraction', () => {
    let pay: number = 205;
    let price: number = 100;

    let total: number = 105;

    expect(component.spend(pay, price)).toBe(total);
  })
});
