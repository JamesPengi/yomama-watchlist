import Head from "next/head";
import { QuickAdd } from "~/components/QuickAdd";
import { TitlesView } from "~/components/TitlesView";

export default function Home() {
  return (
    <>
      <Head>
        <title>Yo Mama&apos;s Watchlist</title>
      </Head>
      <main className="container mx-auto mt-10 space-y-10">
        <QuickAdd />
        <TitlesView />
      </main>
    </>
  );
}
