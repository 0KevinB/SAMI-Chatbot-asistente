import 'package:flutter/material.dart';
import 'package:sami/services/chat_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _messages.add(
      const ChatMessage(
        text: "Hola, Soy SAMI, dime ¿cómo puedo ayudarte el día de hoy?",
        isBot: true,
        showOptions: true,
      ),
    );
  }

  Future<void> _handleSubmitted(String text) async {
    if (text.isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(text: text, isBot: false));
      _isLoading = true;
    });

    _messageController.clear();

    try {
      final ChatService chatService = ChatService();
      final String botResponse = await chatService.sendQuery(text);

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        title: const Row(
          children: [
            CircleAvatar(
              backgroundColor: Color(0xFF2196F3),
              child: Text('S', style: TextStyle(color: Colors.white)),
            ),
            SizedBox(width: 8),
            Text('SAMI'),
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
    );
  }

  Widget _buildTextComposer() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
      child: Row(
        children: [
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
              backgroundColor: Color(0xFF2196F3),
              child: Text('S', style: TextStyle(color: Colors.white)),
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
                  child: Text(
                    text,
                    style: TextStyle(
                      color: isBot ? Colors.black87 : Colors.white,
                    ),
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
                          onPressed: () {},
                        ),
                        _OptionButton(
                          text: 'Consultar mis recetas',
                          icon: Icons.receipt_long,
                          onPressed: () {},
                        ),
                        _OptionButton(
                          text: 'Otra',
                          icon: Icons.more_horiz,
                          onPressed: () {},
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
