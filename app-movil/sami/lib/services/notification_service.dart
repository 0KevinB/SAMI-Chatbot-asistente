import 'package:flutter/material.dart';

class NotificationMessage {
  final String message;
  final Color color;

  NotificationMessage({
    required this.message,
    this.color = Colors.blue,
  });
}

final List<NotificationMessage> notifications = [
  NotificationMessage(
    message: 'Recuerda tomar tu medicina en 5 minutos',
  ),
  NotificationMessage(
    message: 'Tu próxima cita médica es mañana a las 10:00 AM',
  ),
  NotificationMessage(
    message: 'Es hora de medir tu nivel de glucosa',
  ),
  NotificationMessage(
    message: 'No olvides tomar agua regularmente',
  ),
];
