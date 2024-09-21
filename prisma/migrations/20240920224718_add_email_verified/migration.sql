/*
  Warnings:

  - Added the required column `serviceId` to the `availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` MODIFY `status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `availability` ADD COLUMN `serviceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `confirmationToken` VARCHAR(191) NULL,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
