import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import BackgroundImage from "@/components/BackgroundImage";
import AudioProvider from "@/components/AudioProvider";
import "./globals.css";

const stratumFont = localFont({
  src: [
    {
      path: "./Stratum2WebRegular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Stratum2WebMedium.woff",
      weight: "500",
      style: "medium",
    },
    {
      path: "./Stratum2WebBold.woff",
      weight: "700",
      style: "bold",
    },
  ],
});

export const metadata: Metadata = {
  title: "Counter-Strike Case Simulator",
  description: "Open all the Counter-Strike cases you want for free!",
  metadataBase: new URL("https://case-sim.com"),
  keywords: [
    "counter-strike",
    "csgo",
    "cs:go",
    "cs2",
    "case",
    "simulator",
    "opening",
    "sim",
    "case opening",
  ],
  openGraph: {
    url: "https://case-sim.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6039769769260317"
        crossOrigin="anonymous"
      />
      <body className={`${stratumFont.className} text-white`}>
        <BackgroundImage />
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
