-- CreateEnum
CREATE TYPE "StudyActivityType" AS ENUM ('CHAPTER_READ', 'SESSION_CREATED', 'NOTE_CREATED', 'POST_CREATED');

-- CreateTable
CREATE TABLE "UserStudyStreak" (
    "id" TEXT NOT NULL,
    "current_streak_days" INTEGER NOT NULL DEFAULT 0,
    "longest_streak_days" INTEGER NOT NULL DEFAULT 0,
    "last_study_date" TIMESTAMP(3) NOT NULL,
    "total_study_days" INTEGER NOT NULL DEFAULT 0,
    "total_chapters_studied" INTEGER NOT NULL DEFAULT 0,
    "streak_start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStudyStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStudyActivity" (
    "id" TEXT NOT NULL,
    "activity_type" "StudyActivityType" NOT NULL,
    "activity_date" TIMESTAMP(3) NOT NULL,
    "reference_id" TEXT,
    "time_spent" INTEGER,
    "metadata" JSONB,
    "chapter_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStudyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStudyStreak_user_id_key" ON "UserStudyStreak"("user_id");

-- CreateIndex
CREATE INDEX "UserStudyStreak_user_id_idx" ON "UserStudyStreak"("user_id");

-- CreateIndex
CREATE INDEX "UserStudyActivity_user_id_activity_date_idx" ON "UserStudyActivity"("user_id", "activity_date");

-- CreateIndex
CREATE INDEX "UserStudyActivity_user_id_activity_type_idx" ON "UserStudyActivity"("user_id", "activity_type");

-- AddForeignKey
ALTER TABLE "UserStudyStreak" ADD CONSTRAINT "UserStudyStreak_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyActivity" ADD CONSTRAINT "UserStudyActivity_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "BibleChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStudyActivity" ADD CONSTRAINT "UserStudyActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
