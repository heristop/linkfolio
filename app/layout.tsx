import type { Metadata, Viewport } from "next";
import React from "react";
import { Raleway } from "next/font/google";
import "@/assets/globals.css";
import { Analytics, ThemeProvider } from "@/index";
import { buildMetadata } from "@/seo";
import { appUrl } from "./lib/siteMeta";
import { ThemePresetProvider } from "./lib/ThemePresetProvider";
import { PRESET_BOOT_SCRIPT } from "./lib/themePreset";
import userConfig from "../config/user.config";

const font = Raleway({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const baseMetadata = buildMetadata(userConfig, { siteUrl: appUrl });

export const metadata: Metadata = {
  ...baseMetadata,
  manifest: "/manifest.json",
  other: {
    ...baseMetadata.other,
    "msapplication-TileColor": userConfig.themeColor ?? "#2f5d62",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: userConfig.themeColor ?? "#2f5d62",
    },
    // Mirrors --color-background-start under .dark, so the browser chrome
    // matches the page rather than sitting against it. Measured from the
    // rendered page: oklch(0.165 0.006 220). Update alongside the .dark block
    // in globals.css.
    { media: "(prefers-color-scheme: dark)", color: "#0c0f10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={userConfig.lang ?? "en"} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={userConfig.themeColor ?? "#2f5d62"}
        />

        {/* Before the stylesheet's defaults get a chance to paint. */}
        <script dangerouslySetInnerHTML={{ __html: PRESET_BOOT_SCRIPT }} />
      </head>

      <body className={font.className}>
        <ThemeProvider>
          <ThemePresetProvider>{children}</ThemePresetProvider>
        </ThemeProvider>
        <Analytics config={userConfig.analytics} />
      </body>
    </html>
  );
}
