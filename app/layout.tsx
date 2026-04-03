import React from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "@/assets/globals.css";
import { Analytics } from "@/index";
import userConfig from "../config/user.config";

const font = Raleway({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_APP_URL ?? "https://linkfolio-demo.vercel.app";

export const metadata: Metadata = {
  title: userConfig.metaTitle ?? "Linkfolio",
  description: userConfig.metaDescription ?? "Linkfolio",
  metadataBase: new URL(appUrl),
  openGraph: {
    type: "website",
    title: userConfig.metaTitle ?? "Linkfolio",
    description: userConfig.metaDescription ?? "Linkfolio",
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: userConfig.metaTitle ?? "Linkfolio",
    description: userConfig.metaDescription ?? "Linkfolio",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: userConfig.metaTitle ?? "Linkfolio",
  },
  other: {
    "msapplication-TileColor": userConfig.themeColor ?? "#2f5d62",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta
          name="theme-color"
          content={userConfig.themeColor ?? "#2f5d62"}
        />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={userConfig.themeColor ?? "#2f5d62"}
        />

        <Analytics />
      </head>

      <body className={font.className}>{children}</body>
    </html>
  );
}
