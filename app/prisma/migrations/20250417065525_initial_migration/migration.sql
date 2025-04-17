-- CreateEnum
CREATE TYPE "BibleStudyNoteType" AS ENUM ('QUOTE', 'UNDERSTANDING', 'FREE_FORM', 'QUESTIONS');

-- CreateEnum
CREATE TYPE "BibleStudyPostType" AS ENUM ('TEXT', 'IMAGE');

-- CreateEnum
CREATE TYPE "BibleStudyPostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ChatMessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "BibleVersion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleBook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "version_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleChapter" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "book_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleHeading" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "start_verse_number" INTEGER NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleHeading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleVerse" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "verse_number" INTEGER NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleVerse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleStudySession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "book_id" TEXT NOT NULL,
    "start_chapter_id" TEXT NOT NULL,
    "end_chapter_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleStudyNote" (
    "id" TEXT NOT NULL,
    "type" "BibleStudyNoteType" NOT NULL,
    "data" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleStudyPost" (
    "id" TEXT NOT NULL,
    "type" "BibleStudyPostType" NOT NULL,
    "status" "BibleStudyPostStatus" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_json" JSONB,
    "content_text" TEXT,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleStudyPostLike" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyPostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatThread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "thread_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT,
    "tier" "UserTier" NOT NULL DEFAULT 'FREE',
    "preferred_bible_version_id" TEXT,
    "last_visited_book_id" TEXT,
    "last_visited_chapter_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollowRequest" (
    "id" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL DEFAULT 'PENDING',
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFollowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleVersion_abbreviation_key" ON "BibleVersion"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "BibleBook_version_id_number_key" ON "BibleBook"("version_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "BibleChapter_book_id_number_key" ON "BibleChapter"("book_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "BibleHeading_chapter_id_start_verse_number_key" ON "BibleHeading"("chapter_id", "start_verse_number");

-- CreateIndex
CREATE INDEX "BibleVerse_chapter_id_idx" ON "BibleVerse"("chapter_id");

-- CreateIndex
CREATE UNIQUE INDEX "BibleVerse_chapter_id_verse_number_key" ON "BibleVerse"("chapter_id", "verse_number");

-- CreateIndex
CREATE INDEX "BibleStudySession_user_id_idx" ON "BibleStudySession"("user_id");

-- CreateIndex
CREATE INDEX "BibleStudyNote_session_id_idx" ON "BibleStudyNote"("session_id");

-- CreateIndex
CREATE INDEX "BibleStudyNote_session_id_order_idx" ON "BibleStudyNote"("session_id", "order");

-- CreateIndex
CREATE INDEX "BibleStudyPost_session_id_idx" ON "BibleStudyPost"("session_id");

-- CreateIndex
CREATE INDEX "BibleStudyPost_status_created_at_idx" ON "BibleStudyPost"("status", "created_at");

-- CreateIndex
CREATE INDEX "BibleStudyPost_user_id_status_created_at_idx" ON "BibleStudyPost"("user_id", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "BibleStudyPost_session_id_user_id_key" ON "BibleStudyPost"("session_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "BibleStudyPostLike_post_id_user_id_key" ON "BibleStudyPostLike"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserFollowRequest_from_user_id_status_createdAt_idx" ON "UserFollowRequest"("from_user_id", "status", "createdAt");

-- CreateIndex
CREATE INDEX "UserFollowRequest_to_user_id_status_createdAt_idx" ON "UserFollowRequest"("to_user_id", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "BibleBook" ADD CONSTRAINT "BibleBook_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "BibleVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleChapter" ADD CONSTRAINT "BibleChapter_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleHeading" ADD CONSTRAINT "BibleHeading_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "BibleChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleVerse" ADD CONSTRAINT "BibleVerse_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "BibleChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudySession" ADD CONSTRAINT "BibleStudySession_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudySession" ADD CONSTRAINT "BibleStudySession_start_chapter_id_fkey" FOREIGN KEY ("start_chapter_id") REFERENCES "BibleChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudySession" ADD CONSTRAINT "BibleStudySession_end_chapter_id_fkey" FOREIGN KEY ("end_chapter_id") REFERENCES "BibleChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudySession" ADD CONSTRAINT "BibleStudySession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudyNote" ADD CONSTRAINT "BibleStudyNote_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "BibleStudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudyPost" ADD CONSTRAINT "BibleStudyPost_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "BibleStudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudyPost" ADD CONSTRAINT "BibleStudyPost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudyPostLike" ADD CONSTRAINT "BibleStudyPostLike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "BibleStudyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleStudyPostLike" ADD CONSTRAINT "BibleStudyPostLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatThread" ADD CONSTRAINT "ChatThread_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_preferred_bible_version_id_fkey" FOREIGN KEY ("preferred_bible_version_id") REFERENCES "BibleVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_last_visited_book_id_fkey" FOREIGN KEY ("last_visited_book_id") REFERENCES "BibleBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_last_visited_chapter_id_fkey" FOREIGN KEY ("last_visited_chapter_id") REFERENCES "BibleChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowRequest" ADD CONSTRAINT "UserFollowRequest_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowRequest" ADD CONSTRAINT "UserFollowRequest_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
