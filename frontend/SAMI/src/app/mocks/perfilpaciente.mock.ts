export const pacientes = [
  {
    cedula: '1105589426',
    nombres: 'Kevin Alexander',
    apellidos: 'Barrazueta Quizhpe',
    telefono: '+593 962645019',
    fechaEvaluacion: '13-Ago-2023, 10:00 AM',
    correo: 'kabarrazueta@gmail.com',
    history: [
      {
        id: '222231231', // Identificador único
        pacienteCedula: '22222222', // Referencia al paciente
        medicoCedula: '3333333', // Médico que realizó el registro
        fecha: '20-Sep-2024', // Fecha del registro
        descripcion: 'PACIENTE ACUDE A CONTROL POR CUADRO DE ESTENOSIS A NIVEL DE CAROTIDA SUPERIOR, ACTUALMENTE ASINTOMÁTICO' // Resumen del encuentro médico
      },
      {
      id: '24234211', // Identificador único
      pacienteCedula: '22222222', // Referencia al paciente
      medicoCedula: '3333333', // Médico que realizó el registro
      fecha: '20-Sep-2024',
      descripcion: 'CALAMBRE'
      }
    ]
  },
];
