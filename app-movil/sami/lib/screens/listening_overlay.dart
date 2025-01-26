import 'package:flutter/material.dart';

class ListeningOverlay extends StatelessWidget {
  final VoidCallback onClose;
  final double soundLevel;
  final String recognizedText;
  final VoidCallback? onReplay;
  final String? lastRecording;

  const ListeningOverlay({
    Key? key,
    required this.onClose,
    this.soundLevel = 0,
    required this.recognizedText,
    this.onReplay,
    this.lastRecording,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withOpacity(0.95),
      child: Stack(
        children: [
          // Close button
          Positioned(
            top: 16,
            right: 16,
            child: IconButton(
              icon: Icon(Icons.close, color: Colors.blue.shade900),
              onPressed: onClose,
            ),
          ),
          // Main content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Escuchando...',
                  style: TextStyle(
                    color: Colors.blue.shade900,
                    fontSize: 24,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 48),
                // Animated microphone button
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 1.0, end: 1.0 + (soundLevel * 0.3)),
                  duration: const Duration(milliseconds: 100),
                  builder: (context, scale, child) {
                    return Transform.scale(
                      scale: scale,
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.blue.shade900,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.blue.shade200.withOpacity(0.3),
                              blurRadius: 20,
                              spreadRadius: 10,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.mic,
                          color: Colors.white,
                          size: 40,
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 48),
                // Recognized text display
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade900.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    recognizedText.isEmpty ? 'Di algo...' : recognizedText,
                    style: TextStyle(
                      color: Colors.blue.shade900,
                      fontSize: 18,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                // Replay last recording button
                if (lastRecording != null && lastRecording!.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 24),
                    child: TextButton.icon(
                      onPressed: onReplay,
                      icon: Icon(Icons.replay, color: Colors.blue.shade900),
                      label: Text(
                        'Volver a escuchar',
                        style: TextStyle(color: Colors.blue.shade900),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
