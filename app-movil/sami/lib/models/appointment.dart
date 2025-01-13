class Appointment {
  final String id;
  final String pacienteCedula;
  final String medicoCedula;
  final String fecha;
  final String horaInicio;
  final String horaFin;
  final String estado;
  final String especialidad;
  final String notas;
  final String motivoConsulta;
  final String? motivoEstado; // Add this field

  Appointment({
    required this.id,
    required this.pacienteCedula,
    required this.medicoCedula,
    required this.fecha,
    required this.horaInicio,
    required this.horaFin,
    required this.estado,
    required this.especialidad,
    required this.notas,
    required this.motivoConsulta,
    this.motivoEstado, // Add this field
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      id: json['id'],
      pacienteCedula: json['pacienteCedula'],
      medicoCedula: json['medicoCedula'],
      fecha: json['fecha'],
      horaInicio: json['horaInicio'],
      horaFin: json['horaFin'],
      estado: json['estado'],
      especialidad: json['especialidad'],
      notas: json['notas'],
      motivoConsulta: json['motivoConsulta'],
      motivoEstado: json['motivoEstado'], // Add this field
    );
  }
}
