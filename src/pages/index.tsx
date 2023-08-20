import Head from "next/head";
import { QuickAdd } from "~/components/QuickAdd";

export default function Home() {
  return (
    <>
      <Head>
        <title>Yo Mama's Watchlist</title>
      </Head>
      <main className="container mx-auto mt-10 space-y-10">
        <QuickAdd />
      </main>
    </>
  );
}
