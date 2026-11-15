import type { Metadata, Viewport } from "next";
import {
  cinzel,
  ebGaramond,
  instrumentSans,
  jetbrainsMono,
  notoDevanagari,
  syne,
} from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinora — Care without watching",
  description:
    "An agent that helps families care for an aging parent without making the parent feel monitored. Most days, Kinora says nothing at all.",
  applicationName: "Kinora",
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${syne.variable} ${cinzel.variable} ${ebGaramond.variable} ${jetbrainsMono.variable} ${notoDevanagari.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
