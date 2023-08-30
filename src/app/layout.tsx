import { type Metadata } from "next";
import React from "react";
import Provider from "./_trpc/Provider";
import { twMerge } from "tailwind-merge";
import { Rubik } from "next/font/google";
import "./globals.css";

const fontSans = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Yo Mama's Watchlist",
  description: "A watchlist for friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={twMerge(
          "flex min-h-screen flex-col font-sans",
          fontSans.variable
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
