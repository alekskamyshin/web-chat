import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "@/shared/styles/globals.css";
import QueryProvider from "@/shared/lib/providers/QueryProvider";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat app",
  description: "Basic web chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${display.variable} ${sans.variable} h-full antialiased`}
      >
      <body className="h-screen overflow-hidden flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
