import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialClinicoPacienteComponent } from './historial-clinico-paciente.component';

describe('HistorialClinicoPacienteComponent', () => {
  let component: HistorialClinicoPacienteComponent;
  let fixture: ComponentFixture<HistorialClinicoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialClinicoPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialClinicoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
