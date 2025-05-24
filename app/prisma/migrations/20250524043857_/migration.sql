-- AlterTable
ALTER TABLE "BibleStudyPost" ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "BibleStudyPostImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyPostImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BibleStudyPostImage" ADD CONSTRAINT "BibleStudyPostImage_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "BibleStudyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
