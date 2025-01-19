import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HistoriaClinica } from './../../interfaces/form.data';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SlidebarComponent } from '../../components/slidebar/slidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SlidebarComponent,
    HttpClientModule,
  ],
  standalone: true,
})
export class HistoriaClinicaComponent implements OnInit, AfterViewInit {
  historiaClinicaForm: FormGroup | any;
  pdfText: string = '';
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  pdfReady = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.historiaClinicaForm = this.fb.group({
      establecimientoDeSalud: ['', Validators.required],
      paciente: this.fb.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        sexo: ['', Validators.required],
        edad: ['', Validators.required],
        numeroHistoriaClinica: ['', Validators.required],
      }),
      antecedentes: this.fb.group({
        personales: [''],
        quirurgicos: [''],
        alergias: [''],
        habitos: [''],
        tratamientosEspeciales: [''],
        ginecologicosObstetricos: [''],
        familiares: [''],
      }),
      indicacionesAdicionales: [''],
      signosVitales: this.fb.group({
        fecha: ['', Validators.required],
        profesional: ['', Validators.required],
        especialidad: ['', Validators.required],
        temperatura: [''],
        presionArterial: [''],
        pulsoFrecuenciaCardiaca: [''],
        frecuenciaRespiratoria: [''],
        saturacionOxigeno: [''],
        talla: [''],
        peso: this.fb.group({
          kg: [''],
          lb: [''],
        }),
        imc: [''],
        perimetroCefalico: [''],
      }),
      motivoConsulta: ['', Validators.required],
      enfermedadProblemaActual: ['', Validators.required],
      examenFisico: ['', Validators.required],
      diagnosticos: this.fb.group({
        presuntivos: this.fb.array([]),
        definitivos: this.fb.array([]),
      }),
      planesTratamiento: this.fb.array([]),
      evolucion: [''],
      prescripciones: this.fb.array([]),
      observacionesRecomendaciones: [''],
      atencion: this.fb.group({
        fecha: ['', Validators.required],
        hora: ['', Validators.required],
        especialidad: ['', Validators.required],
        nombreProfesional: ['', Validators.required],
        codigo: ['', Validators.required],
      }),
    });
  }
  ngAfterViewInit() {
    this.pdfReady = true;
  }

  get diagnosticosPresuntivos() {
    return this.historiaClinicaForm.get(
      'diagnosticos.presuntivos'
    ) as FormArray;
  }

  get diagnosticosDefinitivos() {
    return this.historiaClinicaForm.get(
      'diagnosticos.definitivos'
    ) as FormArray;
  }

  get planesTratamiento() {
    return this.historiaClinicaForm.get('planesTratamiento') as FormArray;
  }

  get prescripciones() {
    return this.historiaClinicaForm.get('prescripciones') as FormArray;
  }

  addDiagnosticoPresuntivo() {
    this.diagnosticosPresuntivos.push(
      this.fb.group({
        descripcion: ['', Validators.required],
        codigo: ['', Validators.required],
      })
    );
  }

  addDiagnosticoDefinitivo() {
    this.diagnosticosDefinitivos.push(
      this.fb.group({
        descripcion: ['', Validators.required],
        codigo: ['', Validators.required],
      })
    );
  }

  addPlanTratamiento() {
    this.planesTratamiento.push(this.fb.control('', Validators.required));
  }

  addPrescripcion() {
    this.prescripciones.push(
      this.fb.group({
        medicamento: ['', Validators.required],
        cantidad: ['', Validators.required],
        indicaciones: ['', Validators.required],
      })
    );
  }

  removeDiagnosticoPresuntivo(index: number) {
    this.diagnosticosPresuntivos.removeAt(index);
  }

  removeDiagnosticoDefinitivo(index: number) {
    this.diagnosticosDefinitivos.removeAt(index);
  }

  removePlanTratamiento(index: number) {
    this.planesTratamiento.removeAt(index);
  }

  removePrescripcion(index: number) {
    this.prescripciones.removeAt(index);
  }

  onSubmit() {
    if (this.historiaClinicaForm.valid) {
      console.log(this.historiaClinicaForm.value);
    } else {
      this.markFormGroupTouched(this.historiaClinicaForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('Por favor, seleccione un archivo PDF.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      this.pdfText = fullText;
      this.fillFormFromPDF();
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      alert('Hubo un error al procesar el PDF. Por favor, inténtelo de nuevo.');
    }
  }

  fillFormFromPDF() {
    const extractInfo = (fieldName: string): string => {
      const regex = new RegExp(`${fieldName}[:\\s]+(.*?)(?=\\n|$)`, 'i');
      const match = this.pdfText.match(regex);
      return match ? match[1].trim() : '';
    };

    this.historiaClinicaForm.patchValue({
      establecimientoDeSalud: extractInfo('Establecimiento de Salud'),
      paciente: {
        nombre: extractInfo('Nombre'),
        apellidos: extractInfo('Apellidos'),
        sexo: extractInfo('Sexo'),
        edad: extractInfo('Edad'),
        numeroHistoriaClinica: extractInfo('Número de Historia Clínica'),
      },
      motivoConsulta: extractInfo('Motivo de Consulta'),
      enfermedadProblemaActual: extractInfo('Enfermedad o Problema Actual'),
      examenFisico: extractInfo('Examen Físico'),
    });
  }

  generatePDF() {
    if (!this.pdfReady) {
      console.error('El contenido del PDF no está listo');
      return;
    }

    const content = this.pdfContent.nativeElement;
    const doc = new jsPDF('p', 'mm', 'a4');
    const options = {
      background: 'white',
      scale: 3,
    };

    html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('historia_clinica.pdf');
    });
  }
}
