/*
  Warnings:

  - You are about to drop the column `confirmationToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `confirmationToken`,
    DROP COLUMN `emailVerified`;
