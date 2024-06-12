-- CreateTable
CREATE TABLE `sundata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lon` DOUBLE NULL,
    `lat` DOUBLE NULL,
    `city` VARCHAR(512) NULL,
    `class` VARCHAR(512) NULL,
    `state` VARCHAR(512) NULL,
    `annual` INTEGER NULL,
    `jan` INTEGER NULL,
    `feb` INTEGER NULL,
    `mar` INTEGER NULL,
    `apr` INTEGER NULL,
    `may` INTEGER NULL,
    `jun` INTEGER NULL,
    `jul` INTEGER NULL,
    `aug` INTEGER NULL,
    `sep` INTEGER NULL,
    `oct` INTEGER NULL,
    `nov` INTEGER NULL,
    `dec` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
