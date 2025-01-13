import 'dart:convert';
import 'package:http/http.dart' as http;

class ChatService {
  final String _baseUrl = 'http://localhost:3000';

  String _cleanGeminiResponse(String text) {
    return text
        .replaceAll(RegExp(r'\*\*([^*]*)\*\*'), r'$1') // Remove bold markers
        .replaceAll(RegExp(r'\*([^*]*)\*'), r'$1') // Remove italic markers
        .replaceAll(RegExp(r'```[^`]*```'), '') // Remove code blocks
        .replaceAll(RegExp(r'\$1\s*'), '') // Remove $1 markers
        .trim();
  }

  Future<String> sendQuery(String query) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/api/chatbot/query'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
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
}
