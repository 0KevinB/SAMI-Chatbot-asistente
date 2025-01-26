import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:sami/services/auth_service.dart';

class ChatService {
  final String _baseUrl = 'http://localhost:3000';

  String _cleanGeminiResponse(String text) {
    return text
        .replaceAll(RegExp(r'\*\*([^*]*)\*\*'), r'$1')
        .replaceAll(RegExp(r'\*([^*]*)\*'), r'$1')
        .replaceAll(RegExp(r'\`\`\`[^`]*\`\`\`'), '')
        .replaceAll(RegExp(r'\$1\s*'), '')
        .trim();
  }

  Future<String> sendQuery(String query) async {
    if (query.toLowerCase().contains('historial clínico')) {
      return await _fetchMedicalHistory();
    } else if (query.toLowerCase().contains('consultar receta')) {
      return 'NAVIGATE_TO_PRESCRIPTION_SCREEN';
    } else if (query.toLowerCase().contains('citas médicas')) {
      return 'NAVIGATE_TO_APPOINTMENTS_SCREEN';
    }

    final response = await http.post(
      Uri.parse('$_baseUrl/api/chatbot/query'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${await AuthService.getToken()}',
      },
      body: jsonEncode(<String, String>{
        'query': query,
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      final String rawText =
          data['response']['candidates'][0]['content']['parts'][0]['text'];
      return _cleanGeminiResponse(rawText);
    } else {
      throw Exception('Failed to load response');
    }
  }

  Future<String> _fetchMedicalHistory() async {
    final patientId = await AuthService.getUserId();
    final response = await http.get(
      Uri.parse('$_baseUrl/api/patients/$patientId'),
      headers: {
        'Authorization': 'Bearer ${await AuthService.getToken()}',
      },
    );

    if (response.statusCode == 200) {
      final patientData = json.decode(response.body);
      final historiaClinicaId = patientData['historiasClinicas'][0]['id'];

      final historiaClinicaResponse = await http.get(
        Uri.parse('$_baseUrl/api/historias-clinicas/$historiaClinicaId'),
        headers: {
          'Authorization': 'Bearer ${await AuthService.getToken()}',
        },
      );

      if (historiaClinicaResponse.statusCode == 200) {
        final historiaClinica = json.decode(historiaClinicaResponse.body);
        return _formatMedicalHistoryResponse(patientData, historiaClinica);
      }
    }

    throw Exception('Failed to fetch medical history');
  }

  String _formatMedicalHistoryResponse(
      Map<String, dynamic> patientData, Map<String, dynamic> historiaClinica) {
    return '''
    Información del paciente:
    Nombre: ${patientData['nombre']} ${patientData['apellido']}
    Fecha de nacimiento: ${patientData['fechaNacimiento']}
    Género: ${patientData['genero']}
    
    Última historia clínica:
    Fecha: ${historiaClinica['fecha']}
    Descripción: ${historiaClinica['descripcion']}
    
    Medicamentos actuales:
    ${patientData['medicamentos'].map((med) => '- ${med['nombre']} ${med['dosis']} ${med['frecuencia']}').join('\n')}
    
    Últimos niveles de glucosa:
    ${patientData['nivelesGlucosa'].take(3).map((nivel) => '- ${nivel['fecha']}: ${nivel['valor']} ${nivel['unidad']} (${nivel['contexto']})').join('\n')}
    ''';
  }
}
