"use client";

import { type PaymentIntent } from "@stripe/stripe-js";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

type Props = {
  paymentIntentStatus: PaymentIntent.Status;
};

export default function ConfirmationPage({ paymentIntentStatus }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-md flex-col gap-4 rounded-lg border bg-sidebar p-6">
        <h1 className="text-lg font-medium">Payment confirmation</h1>
        {paymentIntentStatus === "succeeded" && (
          <p className="flex items-start gap-2">
            <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Thank you for purchasing Lumen Pro. You can now access all of our
              features.
            </span>
          </p>
        )}
        {paymentIntentStatus === "canceled" && (
          <p className="flex items-start gap-2">
            <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
            <span className="text-sm text-muted-foreground">
              We did not receive your payment for Lumen Pro. Please try again or
              use a different payment method.
            </span>
          </p>
        )}
        <div className="mt-4 flex">
          <Button variant="outline" asChild>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
