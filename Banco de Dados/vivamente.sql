DROP DATABASE IF EXISTS vivamente;
CREATE DATABASE vivamente;
USE vivamente;

CREATE TABLE categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100)
);

CREATE TABLE conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150),
    descricao TEXT,
    imagem VARCHAR(1200),
    categoria_id INT,
    autor VARCHAR(100),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100)
);

CREATE TABLE comentario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto TEXT,
    conteudo_id INT,
    usuario_id INT,
    FOREIGN KEY (conteudo_id) REFERENCES conteudo(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE favorito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    conteudo_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (conteudo_id) REFERENCES conteudo(id)
);

INSERT INTO categoria (nome) VALUES
("Meditação"),
("Ansiedade"),
("Autoajuda"),
("Bem-estar"),
("Sono");

INSERT INTO conteudo (titulo, descricao, imagem, categoria_id, autor) VALUES
("Respiração Consciente", "Técnica simples para acalmar a mente", "https://via.placeholder.com/300", 1, "VivaMente"),
("Controle da Ansiedade", "Dicas para momentos de crise", "https://via.placeholder.com/300", 2, "VivaMente"),
("Pensamento Positivo", "Como melhorar sua mentalidade", "https://via.placeholder.com/300", 3, "VivaMente"),
("Rotina Saudável", "Organização do dia a dia", "https://via.placeholder.com/300", 4, "VivaMente"),
("Melhorar o Sono", "Hábitos para dormir melhor", "https://via.placeholder.com/300", 5, "VivaMente");

INSERT INTO usuario (nome, email, senha) VALUES
("Mathias", "mathias@email.com", "123"),
("Usuario Teste", "teste@email.com", "123");

INSERT INTO comentario (texto, conteudo_id, usuario_id) VALUES
("Muito bom!", 1, 1),
("Me ajudou bastante", 2, 2);

INSERT INTO favorito (usuario_id, conteudo_id) VALUES
(1, 1),
(2, 3);