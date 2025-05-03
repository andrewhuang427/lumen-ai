/*
  Warnings:

  - The values [POST_CREATED] on the enum `StudyActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudyActivityType_new" AS ENUM ('CHAPTER_READ', 'SESSION_CREATED', 'NOTE_CREATED');
ALTER TABLE "UserStudyActivity" ALTER COLUMN "activity_type" TYPE "StudyActivityType_new" USING ("activity_type"::text::"StudyActivityType_new");
ALTER TYPE "StudyActivityType" RENAME TO "StudyActivityType_old";
ALTER TYPE "StudyActivityType_new" RENAME TO "StudyActivityType";
DROP TYPE "StudyActivityType_old";
COMMIT;
