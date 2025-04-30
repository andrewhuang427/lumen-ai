"use client";

import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "../../../trpc/react";
import { Button } from "../../ui/button";

type Props = {
  paymentIntent: string;
  paymentIntentClientSecret: string;
  redirectStatus: string;
};

export default function ConfirmationPage({ paymentIntent }: Props) {
  const {
    data: paymentIntentData,
    error: paymentIntentError,
    isLoading,
  } = api.payments.getPaymentIntent.useQuery({
    paymentIntentId: paymentIntent,
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-md flex-col gap-4 rounded-lg border bg-sidebar p-6">
        <h1 className="text-lg font-medium">Payment confirmation</h1>
        {isLoading && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait while we load your payment details.
          </p>
        )}
        {paymentIntentData?.status === "succeeded" && (
          <p className="flex items-start gap-2">
            <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Thank you for purchasing Lumen Pro. You can now access all of our
              features.
            </span>
          </p>
        )}
        {paymentIntentError && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            An error occurred while loading your payment details.
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
