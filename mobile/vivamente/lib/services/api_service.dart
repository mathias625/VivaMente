import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://localhost:3000";

  static Future<Map<String, dynamic>> login(
    String email,
    String senha,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/auth/login"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "email": email,
        "senha": senha,
        "tipo": "paciente",
      }),
    );

    final dados = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(
      dados["mensagem"] ?? "Erro ao realizar login",
    );
  }

  static Future<Map<String, dynamic>> buscarPaciente(
    int id,
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/paciente/buscar/$id"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    final dados = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(
      dados["mensagem"] ?? "Erro ao buscar paciente",
    );
  }

  static Future<Map<String, dynamic>> registrarCheckin(
    int id,
    String token,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/paciente/checkin"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    final dados = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(
      dados["mensagem"] ?? "Erro ao registrar check-in",
    );
  }
}