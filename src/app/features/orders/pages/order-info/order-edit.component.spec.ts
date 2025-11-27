import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEdit } from './order-edit.component';

describe('OrderInfo', () => {
  let component: OrderEdit;
  let fixture: ComponentFixture<OrderEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
