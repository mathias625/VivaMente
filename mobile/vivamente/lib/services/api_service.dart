
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
   static const String baseUrl = "http://localhost:3000";

  static dynamic _decode(http.Response response) {
    if (response.body.isEmpty) {
      return <String, dynamic>{};
    }

    try {
      return jsonDecode(response.body);
    } catch (_) {
      return <String, dynamic>{
        "mensagem":
            "Resposta inválida do servidor (HTTP ${response.statusCode}).",
      };
    }
  }

  static Exception _networkError(Object error) {
    return Exception(
      "Não foi possível conectar à API ($baseUrl). "
      "Confira se o backend está rodando e se a URL corresponde ao dispositivo. "
      "Detalhe: $error",
    );
  }

  static String _mensagem(dynamic dados, String padrao) {
    if (dados is Map) {
      return dados["mensagem"] ?? padrao;
    }

    return padrao;
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
            body: jsonEncode({
              "email": email,
              "senha": senha,
              "tipo": tipo,
            }),
          )
          .timeout(const Duration(seconds: 15));
    } catch (e) {
      throw _networkError(e);
    }

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      if (dados["usuario"] == null || dados["token"] == null) {
        throw Exception(
          "Resposta de login inválida: usuário/token ausente.",
        );
      }

      return dados;
    }

    throw Exception(
      _mensagem(
        dados,
        "Erro ao realizar login (HTTP ${response.statusCode})",
      ),
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

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao buscar paciente"),
    );
  }

  static Future<Map<String, dynamic>> registrarCheckin(
    int id,
    String token,
  ) async {
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

    if (response.statusCode == 200 && dados is List) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao buscar tarefas"),
    );
  }

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
      body: jsonEncode({"status": status}),
    );

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao atualizar tarefa"),
    );
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

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao buscar psicólogo"),
    );
  }

  static Future<List<dynamic>> listarPacientesPsicologo(
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/psicologo/meus-pacientes"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is List) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao buscar pacientes"),
    );
  }

  static Future<List<dynamic>> listarConsultas(
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/consulta/listar"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is List) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao buscar consultas"),
    );
  }

  static Future<Map<String, dynamic>> criarConversa(
    String token,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/chat/criar"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if ((response.statusCode == 201 || response.statusCode == 200) &&
        dados is Map<String, dynamic>) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao criar conversa"),
    );
  }

  static Future<List<dynamic>> listarConversas(
    String token,
  ) async {
    final response = await http.get(
      Uri.parse("$baseUrl/chat/listar"),
      headers: {"Authorization": "Bearer $token"},
    );

    final dados = _decode(response);

    if (response.statusCode == 200 && dados is List) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao listar conversas"),
    );
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

    if (response.statusCode == 200 && dados is Map<String, dynamic>) {
      return dados;
    }

    throw Exception(
      _mensagem(dados, "Erro ao abrir conversa"),
    );
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

    if (response.statusCode == 200 && dados is Map) {
      return dados["resposta"] ?? "";
    }

    throw Exception(
      _mensagem(dados, "Erro ao enviar mensagem"),
    );
  }
}
