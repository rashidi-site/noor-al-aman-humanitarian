import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Noor Al-Aman Humanitarian",
    template: "%s | Noor Al-Aman Humanitarian",
  },
  description:
    "A community-led humanitarian initiative serving vulnerable families with compassion, accountability, and dignity.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/media/noor-al-aman-mark.webp",
    shortcut: "/media/noor-al-aman-mark.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
