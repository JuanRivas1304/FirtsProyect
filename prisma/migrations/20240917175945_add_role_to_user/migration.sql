-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT';
