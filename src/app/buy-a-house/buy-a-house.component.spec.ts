import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAHouseComponent } from './buy-a-house.component';

describe('BuyAHouseComponent', () => {
  let component: BuyAHouseComponent;
  let fixture: ComponentFixture<BuyAHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyAHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyAHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
