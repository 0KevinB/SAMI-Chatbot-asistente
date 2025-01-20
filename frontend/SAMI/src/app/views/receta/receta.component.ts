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
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-receta',
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SlidebarComponent,
    HttpClientModule,
  ],
  standalone: true,
})
export class RecetaComponent implements OnInit, AfterViewInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  recetaMedicaForm: FormGroup | any;
  pdfReady = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.recetaMedicaForm = this.fb.group({
      doctor: this.fb.group({
        nombre: ['', Validators.required],
        cedula: ['', Validators.required],
        regProf: ['', Validators.required],
        especialidad: ['', Validators.required],
      }),
      fecha: ['', Validators.required],
      recetaNumero: ['', Validators.required],
      proximaCita: [''],
      paciente: this.fb.group({
        nombre: ['', Validators.required],
        cedula: ['', Validators.required],
        edad: ['', Validators.required],
      }),
      diagnostico: ['', Validators.required],
      medicamentos: this.fb.array([]),
      alergias: [''],
      recomendaciones: [''],
    });
    this.addMedicamento();
  }

  ngOnInit() {
    // Obtener los datos del paciente de los queryParams
    this.route.queryParams.subscribe((params) => {
      if (params['cedula']) {
        this.recetaMedicaForm.patchValue({
          paciente: {
            cedula: params['cedula'] || '',
            nombre: params['nombre'] || '',
            apellidos: params['apellido'] || '',
            sexo: params['genero'] || '',
            edad: params['edad'] || '',
            numeroHistoriaClinica: params['cedula'] || '',
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.pdfReady = true;
  }

  get medicamentos() {
    return this.recetaMedicaForm.get('medicamentos') as FormArray;
  }

  addMedicamento() {
    const medicamentoForm = this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: ['', Validators.required],
      indicaciones: ['', Validators.required],
    });
    this.medicamentos.push(medicamentoForm);
  }

  removeMedicamento(index: number) {
    this.medicamentos.removeAt(index);
  }

  onSubmit() {
    if (this.recetaMedicaForm.valid) {
      console.log(this.recetaMedicaForm.value);
    } else {
      this.markFormGroupTouched(this.recetaMedicaForm);
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

      doc.save('receta_medica.pdf');
    });
  }
}
