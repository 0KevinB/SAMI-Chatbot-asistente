import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sami/screens/appointment_screen.dart';
import 'package:sami/services/chat_service.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'listening_overlay.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:sami/screens/prescription_screen.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;
  late stt.SpeechToText _speech;
  late FlutterTts _flutterTts;
  bool _isListening = false;
  bool _isSpeaking = false;
  double _soundLevel = 0;
  String _lastRecording = '';
  String _currentRecognizedText = '';

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _flutterTts = FlutterTts();
    _initializeSpeech();
    _initializeTts();
    _messages.add(
      const ChatMessage(
        text: "Hola, Soy SAMI, dime ¿cómo puedo ayudarte el día de hoy?",
        isBot: true,
        showOptions: true,
      ),
    );
  }

  void _initializeSpeech() async {
    bool available = await _speech.initialize(
      onStatus: (status) => _logMessage('Speech recognition status: $status'),
      onError: (errorNotification) =>
          _logMessage('Speech recognition error: $errorNotification'),
    );
    if (available) {
      _logMessage('Speech recognition initialized successfully');
    } else {
      _logMessage('Speech recognition not available');
    }
  }

  void _initializeTts() async {
    await _flutterTts.setLanguage("es-US");
    await _flutterTts.setVoice(
        {"name": "Google español de Estados Unidos", "locale": "es-US"});

    await _flutterTts.setSpeechRate(1.5);
    await _flutterTts.setPitch(1.3);
    await _flutterTts.setVolume(1.0);
  }

  void _logMessage(String message) {
    debugPrint(message);
  }

  Future<void> _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize(
        onStatus: (status) {
          _logMessage('Speech recognition status: $status');
          if (status == 'done') {
            setState(() => _isListening = false);
          }
        },
        onError: (errorNotification) =>
            _logMessage('Speech recognition error: $errorNotification'),
      );
      if (available) {
        setState(() {
          _isListening = true;
          _currentRecognizedText = '';
          _messageController.clear();
        });
        _speech.listen(
          onResult: (result) {
            setState(() {
              _currentRecognizedText = result.recognizedWords;
              if (result.finalResult) {
                _messageController.text = result.recognizedWords;
                _lastRecording = result.recognizedWords;
                _isListening = false;
                _speech.stop();
                _handleSubmitted(_messageController.text);
              } else {
                _messageController.text = result.recognizedWords;
              }
            });
          },
          listenMode: ListenMode.confirmation,
          pauseFor: const Duration(milliseconds: 3500),
          onSoundLevelChange: (level) {
            setState(() {
              _soundLevel = level;
            });
          },
        );
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  Future<void> _handleSubmitted(String text) async {
    if (_isListening) {
      _speech.stop();
      setState(() => _isListening = false);
    }
    if (text.isEmpty) return;

    final String submittedText = text.toLowerCase();
    _messageController.clear();

    setState(() {
      _messages.add(ChatMessage(text: submittedText, isBot: false));
      _isLoading = true;
    });

    try {
      String botResponse;

      if (submittedText.contains('consultar mi historial') ||
          submittedText.contains('historial clínico')) {
        final patientData = await _fetchPatientData();
        final formattedPatientData = _formatPatientData(patientData);

        if (patientData['historiasClinicas'] != null &&
            patientData['historiasClinicas'].isNotEmpty) {
          final medicalHistoryId = patientData['historiasClinicas'][0]['id'];
          final medicalHistory = await _fetchMedicalHistory(medicalHistoryId);
          final formattedMedicalHistory = _formatMedicalHistory(medicalHistory);

          botResponse =
              'Aquí está tu información más relevante:\n\n$formattedPatientData\n\nHistorial Clínico:\n$formattedMedicalHistory';
        } else {
          botResponse =
              'Aquí está tu información más relevante:\n\n$formattedPatientData\n\nNo se encontró historial clínico.';
        }
      } else if (submittedText.contains('consultar receta') ||
          submittedText.contains('ver recetas')) {
        _navigateToPrescriptionScreen();
        botResponse = 'Te estoy redirigiendo a la pantalla de recetas.';
      } else if (submittedText.contains('consultar citas') ||
          submittedText.contains('citas médicas') ||
          submittedText.contains('ver citas')) {
        _navigateToAppointmentsScreen();
        botResponse = 'Te estoy redirigiendo a la pantalla de citas médicas.';
      } else {
        final ChatService chatService = ChatService();
        botResponse = await chatService.sendQuery(text);
      }

      setState(() {
        _messages.add(ChatMessage(
          text: botResponse,
          isBot: true,
          showOptions: true,
        ));
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add(const ChatMessage(
          text:
              "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.",
          isBot: true,
        ));
        _isLoading = false;
      });
    }
  }

  Future<void> _speakResponse(String response) async {
    if (_isSpeaking) {
      await _flutterTts.stop();
      setState(() => _isSpeaking = false);
    } else {
      setState(() => _isSpeaking = true);
      await _flutterTts.speak(response);
      setState(() => _isSpeaking = false);
    }
  }

  Future<void> _replayLastRecording() async {
    if (_lastRecording.isNotEmpty) {
      setState(() {
        _messageController.text = _lastRecording;
      });
      _handleSubmitted(_lastRecording);
    }
  }

  Future<Map<String, dynamic>> _fetchPatientData() async {
    final response = await http
        .get(Uri.parse('http://localhost:3000/api/patients/1105589426'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load patient data');
    }
  }

  String _formatPatientData(Map<String, dynamic> data) {
    return '''
      Nombre: ${data['nombre']} ${data['apellido']}
      Cédula: ${data['cedula']}
      Fecha de Nacimiento: ${data['fechaNacimiento']}
      Género: ${data['genero']}
      Peso: ${data['peso']} kg
      Altura: ${data['altura']} cm
      Email: ${data['email']}
      Teléfono: ${data['telefono']}
    ''';
  }

  Future<Map<String, dynamic>> _fetchMedicalHistory(String id) async {
    final response = await http
        .get(Uri.parse('http://localhost:3000/api/historias-clinicas/$id'));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load medical history');
    }
  }

  String _formatMedicalHistory(Map<String, dynamic> data) {
    return '''
      ID: ${data['id']}
      Cédula del Paciente: ${data['pacienteCedula']}
      Cédula del Médico: ${data['medicoCedula']}
      Fecha: ${data['fecha']}
      Descripción: ${data['descripcion']}
    ''';
  }

  void _navigateToPrescriptionScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const PrescriptionScreen()),
    );
  }

  void _navigateToAppointmentsScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AppointmentsScreen()),
    );
  }

  @override
  void dispose() {
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(
            leading: const BackButton(),
            title: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image: AssetImage('assets/img/Sami.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text('SAMI',
                    style: GoogleFonts.roboto(
                        textStyle: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                        color: Colors.black)),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.more_vert),
                onPressed: () {},
              ),
            ],
          ),
          body: Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(8.0),
                  reverse: true,
                  itemCount: _messages.length,
                  itemBuilder: (_, index) =>
                      _messages[_messages.length - 1 - index],
                ),
              ),
              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: CircularProgressIndicator(),
                ),
              const Divider(height: 1.0),
              Container(
                decoration: BoxDecoration(color: Theme.of(context).cardColor),
                child: _buildTextComposer(),
              ),
            ],
          ),
        ),
        if (_isListening)
          ListeningOverlay(
            onClose: () {
              _speech.stop();
              setState(() => _isListening = false);
            },
            soundLevel: _soundLevel,
            recognizedText: _currentRecognizedText,
            onReplay: _lastRecording.isNotEmpty ? _replayLastRecording : null,
            lastRecording: _lastRecording,
          ),
      ],
    );
  }

  Widget _buildTextComposer() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
      child: Row(
        children: [
          IconButton(
            icon: Icon(_isListening ? Icons.mic : Icons.mic_none),
            onPressed: _listen,
          ),
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: const InputDecoration(
                hintText: 'Enviar un mensaje...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(20.0)),
                ),
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              ),
              onSubmitted: _handleSubmitted,
            ),
          ),
          const SizedBox(width: 8.0),
          FloatingActionButton(
            onPressed: () => _handleSubmitted(_messageController.text),
            child: const Icon(Icons.send),
          ),
        ],
      ),
    );
  }
}

class ChatMessage extends StatelessWidget {
  final String text;
  final bool isBot;
  final bool showOptions;

  const ChatMessage({
    super.key,
    required this.text,
    this.isBot = false,
    this.showOptions = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment:
            isBot ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isBot) ...[
            const CircleAvatar(
              radius: 16,
              backgroundColor: Colors.transparent,
              backgroundImage: AssetImage('assets/img/Sami.png'),
            ),
            const SizedBox(width: 8.0),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment:
                  isBot ? CrossAxisAlignment.start : CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.all(12.0),
                  decoration: BoxDecoration(
                    color: isBot
                        ? Colors.grey[200]
                        : Theme.of(context).primaryColor,
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          text,
                          style: TextStyle(
                            color: isBot ? Colors.black87 : Colors.white,
                          ),
                        ),
                      ),
                      if (isBot) ...[
                        const SizedBox(width: 8),
                        TtsButton(text: text),
                      ],
                    ],
                  ),
                ),
                if (showOptions && isBot)
                  Container(
                    margin: const EdgeInsets.only(top: 8.0),
                    padding: const EdgeInsets.all(12.0),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Opciones más comunes',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 8.0),
                        _OptionButton(
                          text: 'Consultar mi historial',
                          icon: Icons.history,
                          onPressed: () {
                            final chatScreenState = context
                                .findAncestorStateOfType<_ChatScreenState>();
                            if (chatScreenState != null) {
                              chatScreenState._handleSubmitted(
                                  'Consultar mi historial clínico');
                            }
                          },
                        ),
                        _OptionButton(
                          text: 'Ver recetas',
                          icon: Icons.receipt_long,
                          onPressed: () {
                            final chatScreenState = context
                                .findAncestorStateOfType<_ChatScreenState>();
                            if (chatScreenState != null) {
                              chatScreenState._navigateToPrescriptionScreen();
                            }
                          },
                        ),
                        _OptionButton(
                          text: 'Ver citas',
                          icon: Icons.calendar_month,
                          onPressed: () {
                            final chatScreenState = context
                                .findAncestorStateOfType<_ChatScreenState>();
                            if (chatScreenState != null) {
                              chatScreenState._navigateToAppointmentsScreen();
                            }
                          },
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          if (!isBot) const SizedBox(width: 8.0),
        ],
      ),
    );
  }
}

class TtsButton extends StatefulWidget {
  final String text;

  const TtsButton({Key? key, required this.text}) : super(key: key);

  @override
  _TtsButtonState createState() => _TtsButtonState();
}

class _TtsButtonState extends State<TtsButton> {
  late FlutterTts _flutterTts;
  bool _isSpeaking = false;

  @override
  void initState() {
    super.initState();
    _flutterTts = FlutterTts();
    _initializeTts();
  }

  void _initializeTts() async {
    await _flutterTts.setLanguage("es-US");
    await _flutterTts.setVoice(
        {"name": "Google español de Estados Unidos", "locale": "es-US"});
    await _flutterTts.setSpeechRate(1.2);
    await _flutterTts.setPitch(1.3);
    await _flutterTts.setVolume(1.0);
  }

  Future<void> _toggleSpeech() async {
    if (_isSpeaking) {
      await _flutterTts.stop();
    } else {
      await _flutterTts.speak(widget.text);
    }
    setState(() {
      _isSpeaking = !_isSpeaking;
    });
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(_isSpeaking ? Icons.stop : Icons.volume_up),
      onPressed: _toggleSpeech,
      color: Colors.black87,
      iconSize: 20,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(),
    );
  }

  @override
  void dispose() {
    _flutterTts.stop();
    super.dispose();
  }
}

class _OptionButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback onPressed;

  const _OptionButton({
    required this.text,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 18),
      label: Text(text),
      style: TextButton.styleFrom(
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.symmetric(vertical: 4.0),
      ),
    );
  }
}
