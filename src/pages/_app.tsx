import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// TODO: Switch to app router
// https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration#migrating-from-pages-to-app

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
