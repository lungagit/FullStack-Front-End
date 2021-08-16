import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAHouseComponent } from './sell-a-house.component';

describe('SellAHouseComponent', () => {
  let component: SellAHouseComponent;
  let fixture: ComponentFixture<SellAHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellAHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
