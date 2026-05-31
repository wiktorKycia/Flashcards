/*
  Warnings:

  - You are about to drop the column `folderId` on the `SavedQuiz` table. All the data in the column will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,quizId]` on the table `SavedQuiz` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedQuiz` DROP FOREIGN KEY `SavedQuiz_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedQuiz` DROP FOREIGN KEY `SavedQuiz_userId_fkey`;

-- DropIndex
DROP INDEX `SavedQuiz_folderId_fkey` ON `SavedQuiz`;

-- DropIndex
DROP INDEX `SavedQuiz_userId_quizId_folderId_key` ON `SavedQuiz`;

-- AlterTable
ALTER TABLE `SavedQuiz` DROP COLUMN `folderId`;

-- DropTable
DROP TABLE `Folder`;

-- CreateIndex
CREATE UNIQUE INDEX `SavedQuiz_userId_quizId_key` ON `SavedQuiz`(`userId`, `quizId`);

-- AddForeignKey
ALTER TABLE `UserQuizLike` ADD CONSTRAINT `UserQuizLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
