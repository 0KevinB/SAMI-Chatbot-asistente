// File: screens/appointments_screen.dart

import 'package:flutter/material.dart';
import 'package:sami/screens/appointments_form_screen.dart';
import 'package:table_calendar/table_calendar.dart';
import '../services/appointment_service.dart';
import '../models/appointment.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/date_symbol_data_local.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  // ignore: prefer_final_fields
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('es_ES', null);
    _selectedDay = _focusedDay;
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    try {
      final appointments = await AppointmentService.getAppointments();
      if (mounted) {
        setState(() {
          _appointments = appointments;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al cargar las citas: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
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
        title: Text('CITAS MÉDICAS',
            style:
                GoogleFonts.roboto(fontSize: 18, fontWeight: FontWeight.bold)),
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
                  firstDay: DateTime.now().subtract(const Duration(days: 365)),
                  lastDay: DateTime.now().add(const Duration(days: 365)),
                  focusedDay: _focusedDay,
                  locale: 'es_ES',
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
                  // Añade el eventLoader para mostrar los indicadores
                  eventLoader: (day) {
                    return _getAppointmentsForDay(day);
                  },
                  calendarStyle: CalendarStyle(
                    selectedDecoration: BoxDecoration(
                      color: Colors.blue.shade400,
                      shape: BoxShape.circle,
                    ),
                    todayDecoration: BoxDecoration(
                      color: Colors.blue.shade100,
                      shape: BoxShape.circle,
                    ),
                    defaultTextStyle: const TextStyle(color: Color(0xFF5DABF5)),
                    weekendTextStyle: const TextStyle(color: Color(0xFF857E8E)),
                    selectedTextStyle: const TextStyle(color: Colors.white),
                    todayTextStyle: const TextStyle(color: Colors.white),
                    // Configura el estilo del marcador de eventos
                    markerDecoration: const BoxDecoration(
                      color: Color(0xFF5DABF5),
                      shape: BoxShape.circle,
                    ),
                    markerSize: 6.0, // Tamaño del círculo indicador
                    markersAlignment:
                        Alignment.bottomCenter, // Posición del indicador
                    markerMargin:
                        const EdgeInsets.only(top: 1), // Margen del indicador
                  ),
                  headerStyle: const HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                    titleTextStyle: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  daysOfWeekStyle: const DaysOfWeekStyle(
                    weekdayStyle: TextStyle(color: Colors.black87),
                    weekendStyle: TextStyle(color: Colors.black87),
                  ),
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
                              motivoEstado: appointment.motivoEstado,
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
                      style: ButtonStyle(
                          backgroundColor:
                              WidgetStateProperty.all(const Color(0xFF5DABF5))),
                      child: Text(
                        'Solicitar cita médica',
                        style: GoogleFonts.roboto(
                            textStyle: const TextStyle(
                                color: Color(0xFFFFFFFF),
                                fontSize: 16,
                                fontWeight: FontWeight.bold)),
                      ),
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
  final String? motivoEstado;

  const AppointmentCard({
    super.key,
    required this.title,
    required this.location,
    required this.time,
    required this.status,
    this.motivoEstado,
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
            if (status.toLowerCase() == 'cancelada' &&
                motivoEstado != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline,
                        size: 16, color: Colors.red.shade700),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        motivoEstado!,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.red.shade700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
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
