import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasMedicasComponent } from './citas-medicas.component';

describe('CitasMedicasComponent', () => {
  let component: CitasMedicasComponent;
  let fixture: ComponentFixture<CitasMedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasMedicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasMedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
