"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { type PropsWithChildren, useEffect, useState } from "react";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PK!;
const stripePromise = loadStripe(stripePublishableKey);

type Props = PropsWithChildren<{ clientSecret: string }>;

export default function ElementsProvider({ clientSecret, children }: Props) {
  const { theme } = useTheme();
  const [themeColors, setThemeColors] = useState({
    background: "#ffffff",
    foreground: "#333333",
    primary: "#b58a48",
    primaryForeground: "#ffffff",
    secondary: "#f5ebda",
    input: "#d3d3d3",
    destructive: "#ff0000",
    muted: "#f5f5f5",
    mutedForeground: "#888888",
    border: "#e6e6e6",
    sidebar: "#f7f5f2",
    sidebarForeground: "#333333",
  });

  useEffect(() => {
    setThemeColors({
      background: getCssVariable("--background"),
      foreground: getCssVariable("--foreground"),
      primary: getCssVariable("--primary"),
      primaryForeground: getCssVariable("--primary-foreground"),
      secondary: getCssVariable("--secondary"),
      input: getCssVariable("--input"),
      destructive: getCssVariable("--destructive"),
      muted: getCssVariable("--muted"),
      mutedForeground: getCssVariable("--muted-foreground"),
      border: getCssVariable("--border"),
      sidebar: getCssVariable("--sidebar"),
      sidebarForeground: getCssVariable("--sidebar-foreground"),
    });
  }, [theme]);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" ? "night" : "stripe",
          variables: {
            colorBackground: themeColors.sidebar,
            colorPrimary: themeColors.primary,
            colorText: themeColors.mutedForeground,
            colorDanger: themeColors.destructive,
            colorWarning: themeColors.primary,
            colorSuccess: themeColors.primary,
            fontFamily: "'Open Sans', sans-serif",
            fontSizeBase: "1rem",
            fontWeightNormal: "400",
            fontWeightBold: "600",
            borderRadius: "0.75rem",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": {
              backgroundColor: themeColors.sidebar,
              color: themeColors.mutedForeground,
              borderColor: themeColors.input,
              boxShadow: "none",
              transition: "border-color 0.15s ease",
            },
            ".Input:focus": {
              borderColor: themeColors.primary,
              boxShadow: `0 0 0 1px ${themeColors.primary}`,
            },
            ".Input:hover": {
              borderColor: themeColors.primary,
            },
            ".Input--invalid": {
              borderColor: themeColors.destructive,
              boxShadow: "none",
            },
            ".Input::placeholder": {
              color: themeColors.mutedForeground,
            },
            ".Label": {
              fontWeight: "500",
              fontSize: "0.875rem",
              color: themeColors.mutedForeground,
              marginBottom: "6px",
            },
            ".Error": {
              color: themeColors.destructive,
              boxShadow: "none",
              fontSize: "0.75rem",
            },
            ".TabsContainer": {
              borderColor: themeColors.input,
            },
            ".Tab": {
              color: themeColors.mutedForeground,
            },
            ".Tab:hover": {
              color: themeColors.mutedForeground,
            },
            ".Tab--selected": {
              backgroundColor: themeColors.primary,
              color: themeColors.primaryForeground,
            },
            ".CheckboxInput": {
              borderColor: themeColors.input,
            },
            ".CheckboxInput--checked": {
              backgroundColor: themeColors.primary,
              borderColor: themeColors.primary,
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getCssVariable(variableName: string): string {
  if (typeof window === "undefined") return "";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  const hslMatch =
    /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/.exec(value);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]!);
    const s = parseFloat(hslMatch[2]!);
    const l = parseFloat(hslMatch[3]!);
    return hslToHex(h, s, l);
  }

  return value;
}
