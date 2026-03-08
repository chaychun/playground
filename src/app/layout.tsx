import { AgentationOverlay } from "@/components/agentation";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { DM_Mono, Fraunces, IBM_Plex_Mono, Manrope, Raleway } from "next/font/google";

import "./globals.css";
// Dev-only: DialKit for live animation parameter tuning
import "dialkit/styles.css";
const DialRoot = process.env.NODE_ENV === "development" ? require("dialkit").DialRoot : () => null;

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-body",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} ${fraunces.variable} ${dmMono.variable} ${raleway.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <DialRoot position="top-right" />
        <AgentationOverlay />
      </body>
    </html>
  );
}
