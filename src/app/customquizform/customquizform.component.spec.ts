import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomquizformComponent } from './customquizform.component';

describe('CustomquizformComponent', () => {
  let component: CustomquizformComponent;
  let fixture: ComponentFixture<CustomquizformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomquizformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomquizformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
