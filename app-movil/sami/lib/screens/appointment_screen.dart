import 'package:flutter/material.dart';
import 'package:sami/screens/appointments_form_screen.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/appointment_service.dart';
import '../models/appointment.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    try {
      final appointments = await AppointmentService.getAppointments(
        fecha: _focusedDay.toIso8601String().split('T')[0],
      );
      setState(() {
        _appointments = appointments;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al cargar las citas: $e')),
      );
    }
  }

  List<Appointment> _getAppointmentsForDay(DateTime day) {
    return _appointments.where((appointment) {
      return appointment.fecha == day.toIso8601String().split('T')[0];
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: const Text('CITAS MÉDICAS'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAppointments,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                TableCalendar(
                  firstDay: DateTime.utc(2023, 1, 1),
                  lastDay: DateTime.utc(2024, 12, 31),
                  focusedDay: _focusedDay,
                  calendarFormat: _calendarFormat,
                  selectedDayPredicate: (day) {
                    return isSameDay(_selectedDay, day);
                  },
                  onDaySelected: (selectedDay, focusedDay) {
                    setState(() {
                      _selectedDay = selectedDay;
                      _focusedDay = focusedDay;
                    });
                  },
                  onFormatChanged: (format) {
                    setState(() {
                      _calendarFormat = format;
                    });
                  },
                  eventLoader: (day) {
                    return _getAppointmentsForDay(day);
                  },
                ),
                const Divider(),
                Expanded(
                  child: _selectedDay == null
                      ? const Center(
                          child: Text('Seleccione un día para ver las citas'))
                      : ListView.builder(
                          padding: const EdgeInsets.all(16.0),
                          itemCount:
                              _getAppointmentsForDay(_selectedDay!).length,
                          itemBuilder: (context, index) {
                            final appointment =
                                _getAppointmentsForDay(_selectedDay!)[index];
                            return AppointmentCard(
                              title: appointment.motivoConsulta,
                              location:
                                  'Especialidad: ${appointment.especialidad}',
                              time:
                                  'Hora: ${appointment.horaInicio} - ${appointment.horaFin}',
                              status: appointment.estado,
                            );
                          },
                        ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AppointmentFormScreen(),
                          ),
                        ).then((_) => _loadAppointments());
                      },
                      child: const Text('Solicitar cita médica'),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

class AppointmentCard extends StatelessWidget {
  final String title;
  final String location;
  final String time;
  final String status;

  const AppointmentCard({
    super.key,
    required this.title,
    required this.location,
    required this.time,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _StatusChip(status: status),
              ],
            ),
            const SizedBox(height: 8),
            Text(location),
            const SizedBox(height: 4),
            Text(time),
          ],
        ),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;

  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status.toLowerCase()) {
      case 'pendiente':
        color = Colors.orange;
        break;
      case 'confirmada':
      case 'aceptada':
        color = Colors.green;
        break;
      case 'cancelada':
        color = Colors.red;
        break;
      case 'completada':
        color = Colors.blue;
        break;
      default:
        color = Colors.grey;
    }

    return Chip(
      label: Text(
        status.toUpperCase(),
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
        ),
      ),
      backgroundColor: color,
      padding: const EdgeInsets.symmetric(horizontal: 8),
    );
  }
}
