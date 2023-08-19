import Head from "next/head";
import { QuickAdd } from "~/components/QuickAdd";

export default function Home() {
  return (
    <>
      <Head>
        <title>Yo Mama's Watchlist</title>
      </Head>
      <main className="container mx-auto mt-10 bg-gray-800 text-white">
        <QuickAdd />
      </main>
    </>
  );
}
