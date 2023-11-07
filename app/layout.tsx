import React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/assets/globals.css";
import { Analytics } from "@/index";
import userConfig from "./user.config";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: userConfig.metaTitle,
  description: userConfig.metaDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="application-name"
          content={userConfig.metaTitle ?? "LinkFolio"}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content={userConfig.metaTitle ?? "LinkFolio"}
        />
        <meta
          name="description"
          content={userConfig.metaDescription ?? "LinkFolio"}
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta
          name="msapplication-TileColor"
          content={userConfig.themeColor ?? "#2f5d62"}
        />
        <meta name="theme-color" content={userConfig.themeColor ?? "#2f5d62"} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={userConfig.metaTitle ?? "LinkFolio"}
        />
        <meta
          property="og:description"
          content={userConfig.metaDescription ?? "LinkFolio"}
        />
        <meta
          property="og:image"
          content={process.env.NEXT_APP_URL + "/assets/linkfolio.webp"}
        />
        <meta property="og:url" content={process.env.NEXT_APP_URL} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content={process.env.NEXT_APP_URL + "/assets/linkfolio.webp"}
        />
        <meta
          property="twitter:title"
          content={userConfig.metaTitle ?? "LinkFolio"}
        />
        <meta
          property="twitter:description"
          content={userConfig.metaDescription ?? "LinkFolio"}
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="manifest.json" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={userConfig.themeColor ?? "#2f5d62"}
        />

        <Analytics />
      </head>

      <body className={roboto.className}>{children}</body>
    </html>
  );
}
