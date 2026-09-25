import 'package:flutter/material.dart';

class Menu extends StatelessWidget {
  final int indiceAtual;
  final Function(int) onItemSelecionado;

  const Menu({
    super.key,
    required this.indiceAtual,
    required this.onItemSelecionado,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: indiceAtual,
      selectedItemColor: const Color(0xFF3F51B5),
      unselectedItemColor: Colors.grey,
      type: BottomNavigationBarType.fixed,
      onTap: onItemSelecionado,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: "Início",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.favorite_outline),
          activeIcon: Icon(Icons.favorite),
          label: "Check-in",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: "Perfil",
        ),
      ],
    );
  }
}