import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Rubik } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <main
        className={`flex min-h-screen flex-col space-x-5 bg-gray-800 text-white ${rubik.variable} font-sans`}
      >
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
