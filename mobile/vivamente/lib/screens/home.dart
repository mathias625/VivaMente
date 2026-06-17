import 'package:flutter/material.dart';
import 'perguntas.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home>
    with SingleTickerProviderStateMixin {

  final TextEditingController nomeController =
      TextEditingController();

  final TextEditingController emailController =
      TextEditingController();

  late AnimationController controller;

  late Animation<double> animacao;

  @override
  void initState() {
    super.initState();

    controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 2),
    );

    animacao = Tween<double>(
      begin: 0.5,
      end: 1,
    ).animate(controller);

    controller.forward();
  }

  @override
  void dispose() {
    controller.dispose();
    nomeController.dispose();
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.white,

      body: Padding(

        padding: EdgeInsets.all(20),

        child: Column(

          mainAxisAlignment: MainAxisAlignment.center,

          children: [

            ScaleTransition(

              scale: animacao,

              child: Icon(
                Icons.favorite,
                color: Color(0xFF3F51B5),
                size: 120,
              ),

            ),

            SizedBox(height: 40),

            Text(
              "Digite seu nome",
              style: TextStyle(
                fontSize: 22,
                color: Color(0xFF3F51B5),
              ),
            ),

            SizedBox(height: 20),

            TextField(

              controller: nomeController,

              decoration: InputDecoration(

                hintText: "Seu nome",

                filled: true,

                fillColor: Colors.white,

                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),

              ),

            ),

            SizedBox(height: 15),

            TextField(

              controller: emailController,

              keyboardType: TextInputType.emailAddress,

              decoration: InputDecoration(

                hintText: "Seu email",

                filled: true,

                fillColor: Colors.white,

                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),

              ),

            ),

            SizedBox(height: 30),

            ElevatedButton(

              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF3F51B5),
              ),

              onPressed: () {

                Navigator.push(

                  context,

                  MaterialPageRoute(

                    builder: (context) => Perguntas(
                      nome: nomeController.text,
                    ),

                  ),

                );

              },

              child: Text(
                "Entrar",
                style: TextStyle(
                  color: Colors.white,
                ),
              ),

            ),

          ],

        ),

      ),

    );

  }
}