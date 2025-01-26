import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../services/appointment_service.dart';
import '../models/doctor.dart';
import '../services/auth_service.dart';

class AppointmentFormScreen extends StatefulWidget {
  const AppointmentFormScreen({super.key});

  @override
  State<AppointmentFormScreen> createState() => _AppointmentFormScreenState();
}

class _AppointmentFormScreenState extends State<AppointmentFormScreen> {
  final _formKey = GlobalKey<FormState>();
  DateTime? _selectedDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  Doctor? _selectedDoctor;
  String? _selectedSpecialty;
  final _notesController = TextEditingController();
  final _reasonController = TextEditingController();

  List<Doctor> _doctors = [];
  Set<String> _specialties = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    setState(() => _isLoading = true);
    try {
      final doctors = await AppointmentService.getDoctors();
      final specialties = <String>{};

      for (var doctor in doctors) {
        specialties.addAll(doctor.especialidades);
      }

      setState(() {
        _doctors = doctors;
        _specialties = specialties;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al cargar los médicos: $e')),
        );
      }
    }
  }

  List<Doctor> _getDoctorsBySpecialty(String specialty) {
    return _doctors
        .where((doctor) => doctor.especialidades.contains(specialty))
        .toList();
  }

  String _formatTimeOfDay(TimeOfDay time) {
    final now = DateTime.now();
    final dt = DateTime(now.year, now.month, now.day, time.hour, time.minute);
    return DateFormat('HH:mm').format(dt);
  }

  Future<void> _submitAppointment() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      final pacienteCedula = await AuthService.getUserId();
      if (pacienteCedula == null) throw Exception('Usuario no autenticado');

      if (_selectedDate == null) throw Exception('Seleccione una fecha');
      if (_startTime == null) throw Exception('Seleccione hora de inicio');
      if (_endTime == null) throw Exception('Seleccione hora de fin');
      if (_selectedDoctor == null) throw Exception('Seleccione un médico');
      if (_selectedSpecialty == null) {
        throw Exception('Seleccione una especialidad');
      }

      final appointmentData = {
        "pacienteCedula": pacienteCedula,
        "medicoCedula": _selectedDoctor!.cedula,
        "fecha": DateFormat('yyyy-MM-dd').format(_selectedDate!),
        "horaInicio": _formatTimeOfDay(_startTime!),
        "horaFin": _formatTimeOfDay(_endTime!),
        "estado": "pendiente",
        "especialidad": _selectedSpecialty,
        "notas": _notesController.text,
        "motivoConsulta": _reasonController.text,
      };

      await AppointmentService.createAppointment(appointmentData);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cita creada exitosamente')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al crear la cita: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SOLICITAR CITA MÉDICA',
            style: GoogleFonts.roboto(
              textStyle: const TextStyle(
                color: Color(0xFF000000),
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            )),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Especialidad
                    Text('Especialidad',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _selectedSpecialty,
                      decoration: const InputDecoration(
                        // Estilos del input
                        filled: true,
                        fillColor: Color(0xFFF0F4FF),
                        isDense: true,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        // Bordes redondeados para todos los estados
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF5DABF5), width: 2),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF0466C3), width: 2),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        focusedErrorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                      ),
                      items: _specialties.map((String specialty) {
                        return DropdownMenuItem<String>(
                          value: specialty,
                          child: Text(specialty),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedSpecialty = newValue;
                          _selectedDoctor = null;
                        });
                      },
                      validator: (value) =>
                          value == null ? 'Seleccione una especialidad' : null,
                    ),
                    const SizedBox(height: 16),

                    // Médico
                    Text('Médico',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<Doctor>(
                      value: _selectedDoctor,
                      decoration: const InputDecoration(
                        filled: true,
                        fillColor: Color(0xFFF0F4FF),
                        isDense: true,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF5DABF5), width: 2),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF0466C3), width: 2),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        focusedErrorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                      ),
                      items: _selectedSpecialty == null
                          ? []
                          : _getDoctorsBySpecialty(_selectedSpecialty!)
                              .map((Doctor doctor) {
                              return DropdownMenuItem<Doctor>(
                                value: doctor,
                                child: Text(doctor.nombre),
                              );
                            }).toList(),
                      onChanged: (Doctor? newValue) {
                        setState(() {
                          _selectedDoctor = newValue;
                        });
                      },
                      validator: (value) =>
                          value == null ? 'Seleccione un médico' : null,
                    ),
                    const SizedBox(height: 16),

                    // Fecha
                    Text('Fecha',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () async {
                        final DateTime? picked = await showDatePicker(
                          context: context,
                          initialDate: _selectedDate ?? DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate:
                              DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null && picked != _selectedDate) {
                          setState(() {
                            _selectedDate = picked;
                          });
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0F4FF),
                          border: Border.all(
                            color: const Color(0xFF5DABF5),
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _selectedDate == null
                                  ? 'Seleccionar fecha'
                                  : DateFormat('dd/MM/yyyy')
                                      .format(_selectedDate!),
                              style: GoogleFonts.roboto(
                                color: _selectedDate == null
                                    ? const Color(0xFF857E8E)
                                    : Colors.black,
                              ),
                            ),
                            const Icon(
                              Icons.calendar_today,
                              color: Color(0xFF5DABF5),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Hora de inicio
                    Text('Hora de inicio',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () async {
                        final TimeOfDay? picked = await showTimePicker(
                          context: context,
                          initialTime:
                              _startTime ?? const TimeOfDay(hour: 8, minute: 0),
                        );
                        if (picked != null) {
                          setState(() {
                            _startTime = picked;
                            // Automatically set end time to 1 hour after start time
                            _endTime = TimeOfDay(
                              hour: picked.hour + 1,
                              minute: picked.minute,
                            );
                          });
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0F4FF),
                          border: Border.all(
                            color: const Color(0xFF5DABF5),
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _startTime == null
                                  ? 'Seleccionar hora de inicio'
                                  : _formatTimeOfDay(_startTime!),
                              style: GoogleFonts.roboto(
                                color: _startTime == null
                                    ? const Color(0xFF857E8E)
                                    : Colors.black,
                              ),
                            ),
                            const Icon(
                              Icons.access_time,
                              color: Color(0xFF5DABF5),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Hora de fin
                    Text('Hora de fin',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () async {
                        final TimeOfDay? picked = await showTimePicker(
                          context: context,
                          initialTime:
                              _endTime ?? const TimeOfDay(hour: 9, minute: 0),
                        );
                        if (picked != null) {
                          setState(() {
                            _endTime = picked;
                          });
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0F4FF),
                          border: Border.all(
                            color: const Color(0xFF5DABF5),
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _endTime == null
                                  ? 'Seleccionar hora de fin'
                                  : _formatTimeOfDay(_endTime!),
                              style: GoogleFonts.roboto(
                                color: _endTime == null
                                    ? const Color(0xFF857E8E)
                                    : Colors.black,
                              ),
                            ),
                            const Icon(
                              Icons.access_time,
                              color: Color(0xFF5DABF5),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Motivo de consulta
                    Text('Motivo de consulta',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _reasonController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Ingrese el motivo de la consulta',
                        hintStyle: GoogleFonts.roboto(
                          color: const Color(0xFF857E8E),
                        ),
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        filled: true,
                        fillColor: const Color(0xFFF0F4FF),
                        enabledBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF5DABF5), width: 2),
                        ),
                        focusedBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF0466C3), width: 2),
                        ),
                        errorBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        focusedErrorBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                      ),
                      validator: (value) => value?.isEmpty ?? true
                          ? 'Ingrese el motivo de la consulta'
                          : null,
                    ),
                    const SizedBox(height: 16),

                    // Notas adicionales
                    Text('Notas adicionales',
                        style: GoogleFonts.roboto(
                          textStyle: const TextStyle(
                            color: Color(0xFF857E8E),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _notesController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Ingrese notas adicionales (opcional)',
                        hintStyle: GoogleFonts.roboto(
                          color: const Color(0xFF857E8E),
                        ),
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        filled: true,
                        fillColor: const Color(0xFFF0F4FF),
                        enabledBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF5DABF5), width: 2),
                        ),
                        focusedBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide:
                              BorderSide(color: Color(0xFF0466C3), width: 2),
                        ),
                        errorBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        focusedErrorBorder: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(10)),
                          borderSide: BorderSide(color: Colors.red, width: 2),
                        ),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Botón de envío
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _submitAppointment,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: const Color(0xFF5DABF5),
                        ),
                        child: Text(
                          'Solicitar Cita',
                          style: GoogleFonts.roboto(
                              textStyle: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFFFFFF),
                          )),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  @override
  void dispose() {
    _notesController.dispose();
    _reasonController.dispose();
    super.dispose();
  }
}
