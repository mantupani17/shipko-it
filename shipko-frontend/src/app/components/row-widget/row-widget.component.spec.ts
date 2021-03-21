import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowWidgetComponent } from './row-widget.component';

describe('RowWidhetComponent', () => {
  let component: RowWidgetComponent;
  let fixture: ComponentFixture<RowWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
