import 'package:flutter/material.dart';

class Resultado extends StatelessWidget {

  final String nome;

  final String resultado;

  const Resultado({
    super.key,
    required this.nome,
    required this.resultado,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.white,

      body: Center(

        child: Container(

          margin: EdgeInsets.all(20),

          padding: EdgeInsets.all(30),

          decoration: BoxDecoration(

            color: Colors.blue[50],

            borderRadius: BorderRadius.circular(15),

          ),

          child: Column(

            mainAxisSize: MainAxisSize.min,

            children: [

              Text(
                "$nome você está $resultado",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  color: Color(0xFF3F51B5),
                ),
              ),

              SizedBox(height: 30),

              ElevatedButton(

                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF3F51B5),
                ),

                onPressed: (){
                  Navigator.pop(context);
                },

                child: Text(
                  "Voltar",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),

              )

            ],

          ),

        ),

      ),

    );

  }
}