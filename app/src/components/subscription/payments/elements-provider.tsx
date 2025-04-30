"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { PropsWithChildren } from "react";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PK!;
const stripePromise = loadStripe(stripePublishableKey);

type Props = PropsWithChildren<{ clientSecret: string }>;

export default function ElementsProvider({ clientSecret, children }: Props) {
  const { theme } = useTheme();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" ? "night" : "stripe",
          variables: {
            colorBackground: theme === "dark" ? "#121212" : "#ffffff",
            colorText: "--tw-text-foreground",
            colorDanger: "--tw-text-destructive",
            borderRadius: "0.75rem",
          },
          rules: {
            ".Input": {
              borderColor: "--tw-border-input",
              boxShadow: "none",
            },
            ".Input:focus": {
              borderColor: "--tw-border-primary",
              boxShadow: "none",
            },
            ".Input--invalid": {
              boxShadow: "none",
            },
            ".Label": {
              fontWeight: "500",
              fontSize: "0.875rem",
            },
            ".Error": {
              boxShadow: "none",
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
