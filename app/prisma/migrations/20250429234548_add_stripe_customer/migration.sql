-- CreateTable
CREATE TABLE "UserStripeCustomer" (
    "stripeCustomerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStripeCustomer_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStripeCustomer_stripeCustomerId_key" ON "UserStripeCustomer"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStripeCustomer_userId_key" ON "UserStripeCustomer"("userId");

-- AddForeignKey
ALTER TABLE "UserStripeCustomer" ADD CONSTRAINT "UserStripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
