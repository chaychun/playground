import { AgentationOverlay } from "@/components/agentation";
import { cn } from "@/lib/cn";
import type { Metadata } from "next";
import { DM_Mono, Fraunces, Raleway } from "next/font/google";

import "./globals.css";
// Dev-only: DialKit for live animation parameter tuning
import "dialkit/styles.css";
const DialRoot = process.env.NODE_ENV === "development" ? require("dialkit").DialRoot : () => null;

const raleway = Raleway({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Playground",
  description: "Personal works and interactive component demos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(raleway.variable, dmMono.variable, fraunces.variable, "antialiased")}>
        {children}
        <DialRoot position="top-right" />
        <AgentationOverlay />
      </body>
    </html>
  );
}
