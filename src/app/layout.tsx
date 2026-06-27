import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PillNav } from "@/components/PillNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stax — Plan your wealth",
  description:
    "Retirement planning, investment calculators, and realtime markets in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${plexMono.variable}`}>
      <body className="font-[family-name:var(--font-sans)]">
        <div className="min-h-screen w-full">
          <PillNav />
          <main className="mer-scroll min-h-[60vh]">{children}</main>
        </div>
      </body>
    </html>
  );
}
