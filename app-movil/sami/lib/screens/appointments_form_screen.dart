import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

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
  String? _selectedDoctor;
  String? _selectedSpecialty;
  final _notesController = TextEditingController();
  final _reasonController = TextEditingController();

  // Ejemplo de lista de médicos - Reemplazar con datos reales de tu API
  final List<String> doctors = [
    'Dr. Juan Pérez',
    'Dra. María García',
    'Dr. Carlos López'
  ];
  final List<String> specialties = [
    'Medicina General',
    'Cardiología',
    'Pediatría',
    'Dermatología'
  ];
  final List<String> statuses = [
    'pendiente',
    'confirmada',
    'cancelada',
    'completada'
  ];

  List<TimeOfDay> _generateTimeSlots() {
    List<TimeOfDay> slots = [];
    for (int hour = 8; hour < 18; hour++) {
      slots.add(TimeOfDay(hour: hour, minute: 0));
      slots.add(TimeOfDay(hour: hour, minute: 30));
    }
    return slots;
  }

  String _formatTimeOfDay(TimeOfDay? time) {
    if (time == null) return '';
    final now = DateTime.now();
    final dt = DateTime(now.year, now.month, now.day, time.hour, time.minute);
    return DateFormat.Hm().format(dt);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Solicitar Cita Médica'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Especialidad
                const Text('Especialidad',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedSpecialty,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: specialties.map((String specialty) {
                    return DropdownMenuItem<String>(
                      value: specialty,
                      child: Text(specialty),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedSpecialty = newValue;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor seleccione una especialidad';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Médico
                const Text('Médico',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedDoctor,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: doctors.map((String doctor) {
                    return DropdownMenuItem<String>(
                      value: doctor,
                      child: Text(doctor),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedDoctor = newValue;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Por favor seleccione un médico';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Fecha
                const Text('Fecha',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                InkWell(
                  onTap: () async {
                    final DateTime? picked = await showDatePicker(
                      context: context,
                      initialDate: _selectedDate ?? DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null && picked != _selectedDate) {
                      setState(() {
                        _selectedDate = picked;
                      });
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 15),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _selectedDate == null
                              ? 'Seleccionar fecha'
                              : DateFormat('dd/MM/yyyy').format(_selectedDate!),
                        ),
                        const Icon(Icons.calendar_today),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Hora de inicio
                const Text('Hora de inicio',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButtonFormField<TimeOfDay>(
                  value: _startTime,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: _generateTimeSlots().map((TimeOfDay time) {
                    return DropdownMenuItem<TimeOfDay>(
                      value: time,
                      child: Text(_formatTimeOfDay(time)),
                    );
                  }).toList(),
                  onChanged: (TimeOfDay? newValue) {
                    setState(() {
                      _startTime = newValue;
                      // Automatically set end time 30 minutes after start time
                      if (newValue != null) {
                        _endTime = TimeOfDay(
                          hour: newValue.hour + (newValue.minute + 30) ~/ 60,
                          minute: (newValue.minute + 30) % 60,
                        );
                      }
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Por favor seleccione una hora de inicio';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Hora de fin
                const Text('Hora de fin',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButtonFormField<TimeOfDay>(
                  value: _endTime,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  items: _generateTimeSlots().map((TimeOfDay time) {
                    return DropdownMenuItem<TimeOfDay>(
                      value: time,
                      child: Text(_formatTimeOfDay(time)),
                    );
                  }).toList(),
                  onChanged: (TimeOfDay? newValue) {
                    setState(() {
                      _endTime = newValue;
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Por favor seleccione una hora de fin';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Estado
                const Text('Estado',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const SizedBox(height: 16),

                // Motivo de consulta
                const Text('Motivo de consulta',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _reasonController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Ingrese el motivo de la consulta',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),

                // Notas adicionales
                const Text('Notas adicionales',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Ingrese notas adicionales',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 24),

                // Botón de envío
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        // Aquí iría la lógica para enviar la cita
                        // Implementar la llamada a la API
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text(
                      'Solicitar Cita',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
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
