-- CreateTable
CREATE TABLE `Contato` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `assunto` VARCHAR(191) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `criadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
