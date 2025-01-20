import 'package:flutter/material.dart';
import 'package:sami/screens/home_screen.dart';
// import 'package:sami/screens/chat_screen.dart';
import 'package:sami/screens/profile_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _screens = <Widget>[
    HomeScreen(),
    // ChatScreen(),
    ProfileScreen()
  ];

  // Define el color personalizado
  static const Color customColor = Color(0xFF5DABF5);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        backgroundColor: Colors.white,
        elevation: 0,
        selectedIndex: _selectedIndex,
        onDestinationSelected: (int index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        // Personaliza los colores del NavigationBar
        indicatorColor: customColor,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.home_outlined,
                color: _selectedIndex == 0 ? Colors.white : customColor),
            selectedIcon: Icon(Icons.home, color: Colors.white),
            label: 'Inicio',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline,
                color: _selectedIndex == 1 ? Colors.white : customColor),
            selectedIcon: Icon(Icons.person, color: Colors.white),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}
