import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import {
  Inter as FontSans,
  JetBrains_Mono as FontMono,
} from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    // <ClerkProvider {...pageProps}>
    <div
      className={`flex min-h-screen flex-col space-x-5 ${fontSans.variable} font-sans`}
    >
      <Component {...pageProps} />
    </div>
    // </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
