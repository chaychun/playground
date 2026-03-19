import { AgentationOverlay } from "@/components/agentation";
import { CursorFollower } from "@/components/cursor-follower";
import { DevTools } from "@/components/dev-tools";
import { cn } from "@/lib/cn";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";

import "./globals.css";
import "dialkit/styles.css";
import { DM_Mono, Fraunces, Raleway } from "next/font/google";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Playground — ${AUTHOR}`,
    template: "%s — Playground",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR, url: SITE_URL }],
  creator: AUTHOR,
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(raleway.variable, dmMono.variable, fraunces.variable, "antialiased")}>
        {/* Safari iOS 26 toolbar tint — position:fixed strip at the very top of the DOM */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            backgroundColor: "var(--paper)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
        {children}
        <CursorFollower />
        <AgentationOverlay />
        <DevTools />
      </body>
    </html>
  );
}
