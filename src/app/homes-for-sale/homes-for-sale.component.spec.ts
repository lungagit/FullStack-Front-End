import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomesForSaleComponent } from './homes-for-sale.component';

describe('HomesForSaleComponent', () => {
  let component: HomesForSaleComponent;
  let fixture: ComponentFixture<HomesForSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomesForSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesForSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
