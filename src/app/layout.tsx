import { type Metadata } from "next";
import React from "react";
import Provider from "./_trpc/Provider";
import { twMerge } from "tailwind-merge";
import { Rubik } from "next/font/google";
import "./globals.css";
import { QuickAdd } from "./_components/QuickAdd";
import { Toaster } from "./_components/ui/toaster";

const fontSans = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Yo Mama's Watchlist",
  description: "A watchlist for friends",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html>
      <body className={twMerge("font-sans", fontSans.variable)}>
        <Provider>
          <div className="container mb-10">
            <QuickAdd />
            <div>{props.children}</div>
          </div>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
