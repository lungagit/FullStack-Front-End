import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMyAccountComponent } from './manage-my-account.component';

describe('ManageMyAccountComponent', () => {
  let component: ManageMyAccountComponent;
  let fixture: ComponentFixture<ManageMyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMyAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
