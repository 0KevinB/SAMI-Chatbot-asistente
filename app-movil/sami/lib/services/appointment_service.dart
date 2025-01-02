import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/doctor.dart';
import '../models/appointment.dart';
import 'auth_service.dart';

class AppointmentService {
  static const String baseUrl = 'http://localhost:3000/api';

  static Future<List<Doctor>> getDoctors() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/medics'));

      if (response.statusCode == 200) {
        final List<dynamic> doctorsJson = json.decode(response.body);
        return doctorsJson.map((json) => Doctor.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load doctors: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error loading doctors: $e');
    }
  }

  static Future<void> createAppointment(
      Map<String, dynamic> appointmentData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/citas/crear'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(appointmentData),
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to create appointment: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error creating appointment: $e');
    }
  }

  static Future<List<Appointment>> getAppointments({String? fecha}) async {
    try {
      final cedula = await AuthService.getUserId();
      if (cedula == null) throw Exception('Usuario no autenticado');

      // final queryParams = fecha != null ? '&fecha=$fecha' : '';
      final response = await http.get(
        //Uri.parse('$baseUrl/citas?pacienteCedula=$cedula$queryParams'),
        Uri.parse('$baseUrl/citas?pacienteCedula=$cedula'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['citas'] as List)
            .map((json) => Appointment.fromJson(json))
            .toList();
      } else {
        throw Exception('Failed to load appointments: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error loading appointments: $e');
    }
  }
}
