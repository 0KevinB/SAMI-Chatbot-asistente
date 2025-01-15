import 'dart:async';
import 'package:flutter/material.dart';
import 'package:sami/screens/alert_screen.dart';
import 'package:sami/screens/appointment_screen.dart';
import 'package:sami/screens/chat_screen.dart';
import 'package:sami/screens/glucosa_record_screen.dart';
import 'package:sami/screens/prescription_screen.dart';
import 'package:sami/services/auth_service.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sami/services/notification_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _userName = 'Usuario';
  int _currentNotificationIndex = 0;
  Timer? _notificationTimer;

  @override
  void initState() {
    super.initState();
    _loadUserName();
    _startNotificationTimer();
  }

  Future<void> _loadUserName() async {
    final userName = await AuthService.getUserName();
    setState(() {
      _userName = userName;
    });
  }

  void _startNotificationTimer() {
    _notificationTimer = Timer.periodic(const Duration(seconds: 30), (timer) {
      setState(() {
        _currentNotificationIndex =
            (_currentNotificationIndex + 1) % notifications.length;
      });
    });
  }

  @override
  void dispose() {
    _notificationTimer?.cancel();
    super.dispose();
  }

  void _nextNotification() {
    setState(() {
      _currentNotificationIndex =
          (_currentNotificationIndex + 1) % notifications.length;
    });
  }

  void _previousNotification() {
    setState(() {
      _currentNotificationIndex =
          (_currentNotificationIndex - 1 + notifications.length) %
              notifications.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(Icons.grid_view, color: Color(0xFF5DABF5)),
                  Row(
                    children: [
                      Icon(Icons.cloud_outlined, color: Color(0xFF5DABF5)),
                      SizedBox(width: 16),
                      Icon(Icons.notifications_outlined,
                          color: Color(0xFF5DABF5)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Greeting
              Text(
                'Hola, $_userName',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF5DABF5),
                ),
              ),
              const Text(
                'Dime, ¿Cómo puedo ayudarte el día de hoy?',
                style: TextStyle(
                  fontSize: 16,
                  color: Color(0xFF857E8E),
                ),
              ),
              const SizedBox(height: 24),
              // Robot Image
              Center(
                child: Image.asset(
                  'assets/img/sami_logo.png',
                  height: 150,
                ),
              ),
              // Medication Reminder
              Center(
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios,
                            color: Colors.blue),
                        onPressed: _previousNotification,
                      ),
                      Expanded(
                        child: Text(
                          notifications[_currentNotificationIndex].message,
                          style: const TextStyle(color: Colors.blue),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.arrow_forward_ios,
                            color: Colors.blue),
                        onPressed: _nextNotification,
                      ),
                    ],
                  ),
                ),
              ),

              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.2,
                  padding: const EdgeInsets.all(16),
                  children: [
                    _buildMenuCard(
                      imagePath: 'assets/img/Calendar.png', // Ruta de tu imagen
                      title: 'Citas médicas',
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    const AppointmentsScreen()));
                      },
                    ),
                    _buildMenuCard(
                      imagePath: 'assets/img/Chat.png', // Ruta de tu imagen
                      title: 'Nuevo Chat',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const ChatScreen()),
                        );
                      },
                    ),
                    _buildMenuCard(
                      imagePath: 'assets/img/News.png', // Ruta de tu imagen
                      title: 'Mis recetas',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const PrescriptionScreen()),
                        );
                      },
                    ),
                    _buildMenuCard(
                      imagePath:
                          'assets/img/Microscope.png', // Ruta de tu imagen
                      title: 'Mi glucosa',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const GlucoseRecordForm()),
                        );
                      },
                    ),
                  ],
                ),
              ),
              // Emergency Button
              const SizedBox(
                height: 16,
              ),
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: ElevatedButton(
                    onPressed: () {
                      // Aquí iría la lógica para activar la emergencia
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const AlertScreen()));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF5DABF5),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 50, vertical: 20),
                      textStyle: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.warning, color: Colors.white),
                        const SizedBox(width: 8),
                        Text('Botón de emergencia',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.roboto(
                              textStyle: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                              ),
                            )),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuCard({
    required String imagePath,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        child: Card(
          elevation: 2,
          color: const Color(0xFFF0F4FF), // Color de fondo
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                imagePath,
                height: 70,
                width: 70,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: GoogleFonts.roboto(
                  textStyle: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF857E8E),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
