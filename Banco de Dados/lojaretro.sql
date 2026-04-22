DROP DATABASE IF EXISTS lojaretro;
CREATE DATABASE lojaretro;
USE lojaretro;

CREATE TABLE produto(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    imagem VARCHAR(1200),
    preco DECIMAL(10,2),
    categoria VARCHAR(100),
    marca VARCHAR(50)
);

INSERT INTO produto (nome, imagem, preco, categoria, marca) VALUES
("Super Nintendo", "https://m.media-amazon.com/images/I/41DmrIUyFRL._AC_SY300_SX300_QL70_ML2_.jpg", 899.90, "Console", "Nintendo"),

("Mega Drive", "https://tse1.mm.bing.net/th/id/OIP.whhrimnI2lM1sbK9iuJcZQHaFF?rs=1&pid=ImgDetMain&o=7&rm=3", 799.90, "Console", "Sega"),

("PlayStation 1", "https://tse4.mm.bing.net/th/id/OIP.DLzEojopAkj3Uj-Bw6Sc6gHaEO?rs=1&pid=ImgDetMain&o=7&rm=3", 699.90, "Console", "Sony"),

("Nintendo 64", "https://tse1.mm.bing.net/th/id/OIP.qFAolqrI6R2iBe9hYpyypAHaEN?rs=1&pid=ImgDetMain&o=7&rm=3", 999.90, "Console", "Nintendo"),

("Game Boy Classic", "https://upload.wikimedia.org/wikipedia/commons/f/f4/Game-Boy-FL.jpg", 499.90, "Portátil", "Nintendo"),

("Sonic The Hedgehog", "https://tse2.mm.bing.net/th/id/OIP.nJPU3gvWSCT6jHGCWk6fSQHaLH?rs=1&pid=ImgDetMain&o=7&rm=3", 149.90, "Jogo", "Sega"),

("Crash Bandicoot", "https://tse3.mm.bing.net/th/id/OIP.rNlzwDK3LISLIVfr2qi-YAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", 129.90, "Jogo", "Sony"),

("Controle SNES", "https://tse1.mm.bing.net/th/id/OIP.manPyuU908L6bJpdRiXZAgHaFL?rs=1&pid=ImgDetMain&o=7&rm=3", 99.90, "Acessório", "Nintendo"),

("Controle Mega Drive", "https://tse1.mm.bing.net/th/id/OIP.hUC8kEk0Z1sMviDAEAI51wHaFk?rs=1&pid=ImgDetMain&o=7&rm=3", 89.90, "Acessório", "Sega");