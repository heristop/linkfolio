import "../src/assets/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import userConfig from "./userConfig";

const inter = Inter({ subsets: ["latin"] });

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
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#2f5d62" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={userConfig.metaTitle ?? "LinkFolio"}
        />
        <meta
          property="og:description"
          content={userConfig.metaDescription ?? "LinkFolio"}
        />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
