import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiService {
  // Android Emulator: http://10.0.2.2:3000
  // Flutter Web / desktop: http://localhost:3000
  // Physical phone: http://IP_LOCAL_DO_COMPUTADOR:3000
  static const String baseUrl = 'http://localhost:3000';

  static dynamic _decode(http.Response response) {
    if (response.body.isEmpty) return <String, dynamic>{};
    try {
      return jsonDecode(response.body);
    } catch (_) {
      return <String, dynamic>{
        'mensagem':
            'Resposta inválida do servidor (HTTP ${response.statusCode}).',
      };
    }
  }

  static Exception _networkError(Object error) {
    return Exception(
      'Não foi possível conectar à API ($baseUrl). '
      'Confira se o backend está rodando e se a URL corresponde ao dispositivo. '
      'Detalhe: $error',
    );
  }

  static Future<Map<String, dynamic>> login(
    String email,
    String senha, {
    String tipo = "paciente",
  }) async {
    late final http.Response response;
    try {
      response = await http
          .post(
            Uri.parse("$baseUrl/auth/login"),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode({"email": email, "senha": senha, "tipo": tipo}),
          )
          .timeout(const Duration(seconds: 15));
    } catch (e) {
      throw _networkError(e);
    }

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      if (dados['usuario'] == null || dados['token'] == null) {
        throw Exception('Resposta de login inválida: usuário/token ausente.');
      }
      return dados;
    }

    throw Exception(
      (dados is Map ? dados["mensagem"] : null) ??
          "Erro ao realizar login (HTTP ${response.statusCode})",
    );
  }

  static Future<Map<String, dynamic>> buscarPaciente(
    int id,
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/paciente/buscar/$id"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(dados["mensagem"] ?? "Erro ao buscar paciente");
  }

  static Future<Map<String, dynamic>> registrarCheckin(
    int id,
    String token,
  ) async {
    // O backend enviado não possui rota /paciente/checkin.
    // Não fazer uma chamada que sempre retorna 404.
    throw Exception(
      "O check-in ainda não está implementado no backend. "
      "Adicione uma rota POST /paciente/checkin para habilitar esse recurso.",
    );
  }

  static Future<List<dynamic>> listarTarefas(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/tarefas/listar"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(dados["mensagem"] ?? "Erro ao buscar tarefas");
  }

<<<<<<< HEAD
=======
  static Future<List<dynamic>> listarTarefas(
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/tarefas/listar"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    final dados = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return dados;
    }

    throw Exception(
      dados["mensagem"] ?? "Erro ao buscar tarefas",
    );
  }

>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
  static Future<Map<String, dynamic>> atualizarTarefa(
    int id,
    String status,
    String token,
  ) async {
    final response = await http.put(
      Uri.parse("$baseUrl/tarefas/atualizar/$id"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
<<<<<<< HEAD
      body: jsonEncode({"status": status}),
    );

    final dados = _decode(response);
=======
      body: jsonEncode({
        "status": status,
      }),
    );

    final dados = jsonDecode(response.body);
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523

    if (response.statusCode == 200) {
      return dados;
    }

<<<<<<< HEAD
    throw Exception(dados["mensagem"] ?? "Erro ao atualizar tarefa");
  }

  static Future<Map<String, dynamic>> buscarPsicologo(
    int id,
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/psicologo/buscar/$id"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return dados;
    throw Exception(dados["mensagem"] ?? "Erro ao buscar psicólogo");
  }

  static Future<List<dynamic>> listarPacientesPsicologo(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/psicologo/meus-pacientes"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return dados;
    throw Exception(dados["mensagem"] ?? "Erro ao buscar pacientes");
  }

  static Future<List<dynamic>> listarConsultas(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/consulta/listar"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return dados;
    throw Exception(dados["mensagem"] ?? "Erro ao buscar consultas");
  }

  static Future<Map<String, dynamic>> criarConversa(String token) async {
    final response = await http.post(
      Uri.parse("$baseUrl/chat/criar"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 201 || response.statusCode == 200) return dados;
    throw Exception(dados["mensagem"] ?? "Erro ao criar conversa");
  }

  static Future<List<dynamic>> listarConversas(String token) async {
    final response = await http.get(
      Uri.parse("$baseUrl/chat/listar"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return List<dynamic>.from(dados);
    throw Exception(dados["mensagem"] ?? "Erro ao listar conversas");
  }

  static Future<Map<String, dynamic>> buscarConversa(
    int id,
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/chat/$id"),
      headers: {"Authorization": "Bearer $token"},
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return Map<String, dynamic>.from(dados);
    throw Exception(dados["mensagem"] ?? "Erro ao abrir conversa");
  }

  static Future<String> enviarMensagem(
    int id,
    String texto,
    String token,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/chat/$id/mensagem"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode({"texto": texto}),
    );
    final dados = _decode(response);
    if (response.statusCode == 200) return dados["resposta"] ?? "";
    throw Exception(dados["mensagem"] ?? "Erro ao enviar mensagem");
  }
}
=======
    throw Exception(
      dados["mensagem"] ?? "Erro ao atualizar tarefa",
    );
  }
}
>>>>>>> bcff094e59fa8390c7a153b686f7dbee3928a523
