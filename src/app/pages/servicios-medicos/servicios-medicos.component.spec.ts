import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosMedicosComponent } from './servicios-medicos.component';

describe('ServiciosMedicosComponent', () => {
  let component: ServiciosMedicosComponent;
  let fixture: ComponentFixture<ServiciosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
