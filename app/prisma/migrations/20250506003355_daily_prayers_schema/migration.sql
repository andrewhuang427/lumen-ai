-- CreateTable
CREATE TABLE "UserDailyPrayer" (
    "id" TEXT NOT NULL,
    "prayer_text" TEXT NOT NULL,
    "prayer_json" JSONB,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDailyPrayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserDailyPrayer_user_id_idx" ON "UserDailyPrayer"("user_id");

-- AddForeignKey
ALTER TABLE "UserDailyPrayer" ADD CONSTRAINT "UserDailyPrayer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
