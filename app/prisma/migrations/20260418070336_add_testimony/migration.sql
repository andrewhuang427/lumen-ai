-- CreateTable
CREATE TABLE "Testimony" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_json" JSONB,
    "content_text" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimony_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimony_user_id_idx" ON "Testimony"("user_id");

-- CreateIndex
CREATE INDEX "Testimony_user_id_updated_at_idx" ON "Testimony"("user_id", "updated_at");

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
