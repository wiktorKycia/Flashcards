/*
  Warnings:

  - You are about to drop the column `starred` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `isStarred` on the `UserQuizProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Flashcard` DROP COLUMN `starred`;

-- AlterTable
ALTER TABLE `UserQuizProgress` DROP COLUMN `isStarred`,
    ADD COLUMN `isKnown` BOOLEAN NOT NULL DEFAULT false;
