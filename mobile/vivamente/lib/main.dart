import 'package:flutter/material.dart';

import 'screens/splash.dart';
import 'screens/Paciente/chat_toquinho.dart';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "VivaMente",
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3F51B5),
        ),
        fontFamily: "Roboto",
      ),
      home: const Splash(),
      routes: {
        "/toquinho": (context) => const ChatToquinho(),
      },
    );
  }
}