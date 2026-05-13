import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Founders Edge | Calgary's Entrepreneur Platform",
  description: "A curated membership platform connecting Calgary entrepreneurs to people, opportunities, and resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
