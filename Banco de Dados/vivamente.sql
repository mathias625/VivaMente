DROP DATABASE IF EXISTS vivamente;

CREATE DATABASE vivamente;

USE vivamente;

CREATE TABLE categoria(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100)
);

CREATE TABLE conteudo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150),
    descricao TEXT,
    imagem VARCHAR(1200),
    categoria_id INT,
    autor VARCHAR(100),

    FOREIGN KEY (categoria_id)
    REFERENCES categoria(id)
);

CREATE TABLE usuario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE comentario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto TEXT,
    conteudo_id INT,
    usuario_id INT,

    FOREIGN KEY (conteudo_id)
    REFERENCES conteudo(id),

    FOREIGN KEY (usuario_id)
    REFERENCES usuario(id)
);

CREATE TABLE favorito(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    conteudo_id INT,

    FOREIGN KEY (usuario_id)
    REFERENCES usuario(id),

    FOREIGN KEY (conteudo_id)
    REFERENCES conteudo(id)
);

CREATE TABLE checkin(
    id INT PRIMARY KEY AUTO_INCREMENT,
    emocao VARCHAR(50),
    texto TEXT,
    usuario_id INT,

    FOREIGN KEY (usuario_id)
    REFERENCES usuario(id)
);

CREATE TABLE ajuda(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    mensagem TEXT,
    usuario_id INT,

    FOREIGN KEY (usuario_id)
    REFERENCES usuario(id)
);

CREATE TABLE dicas(
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100),
    categoria VARCHAR(100),
    descricao TEXT
);

INSERT INTO categoria(nome) VALUES
("Meditação"),
("Ansiedade"),
("Autoajuda"),
("Bem-estar"),
("Sono");

INSERT INTO usuario(
    nome,
    email,
    senha
) VALUES

(
    "Mathias",
    "mathias@email.com",
    "123"
);

INSERT INTO dicas(
    titulo,
    categoria,
    descricao
) VALUES

(
    "Respire fundo",
    "Ansiedade",
    "Respire lentamente antes da prova."
),

(
    "Organize seus horários",
    "Estudos",
    "Criar uma rotina ajuda no foco."
);