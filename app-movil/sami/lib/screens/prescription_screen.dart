import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:sami/services/auth_service.dart';

class PrescriptionScreen extends StatefulWidget {
  const PrescriptionScreen({super.key});

  @override
  State<PrescriptionScreen> createState() => _PrescriptionScreenState();
}

class _PrescriptionScreenState extends State<PrescriptionScreen> {
  bool _isLoading = true;
  String? _error;
  List<dynamic>? _prescriptions;

  @override
  void initState() {
    super.initState();
    _fetchPrescription();
  }

  Future<void> _fetchPrescription() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final patientCedula = await AuthService.getUserId();
      if (patientCedula == null) {
        throw Exception('Patient cedula not found');
      }

      final response = await http.get(
        Uri.parse('http://localhost:3000/api/recetas/paciente/112233445'),
        headers: {
          'Authorization': 'Bearer ${await AuthService.getToken()}',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          _prescriptions = json.decode(response.body);
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load prescriptions');
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _launchPDF(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo abrir el PDF')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Recetas'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : _buildPrescriptionsList(),
    );
  }

  Widget _buildPrescriptionsList() {
    if (_prescriptions == null || _prescriptions!.isEmpty) {
      return const Center(child: Text('No hay recetas disponibles'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _prescriptions!.length,
      itemBuilder: (context, index) {
        final prescription = _prescriptions![index];
        final fecha = DateTime.parse(prescription['fecha']);

        return Card(
          margin: const EdgeInsets.only(bottom: 16.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Fecha: ${DateFormat('dd/MM/yyyy').format(fecha)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () => _launchPDF(prescription['pdfUrl']),
                      icon: const Icon(Icons.picture_as_pdf, size: 18),
                      label: const Text('Ver PDF'),
                    ),
                  ],
                ),
                const Divider(height: 24),
                const Text(
                  'Medicamentos:',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                ...List.generate(
                  prescription['medicamentos'].length,
                  (medIndex) {
                    final medicamento = prescription['medicamentos'][medIndex];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            medicamento['nombre'],
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text('Dosis: ${medicamento['dosis']}'),
                          Text('Frecuencia: ${medicamento['frecuencia']}'),
                          Text('Inicio: ${medicamento['fechaInicio']}'),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
