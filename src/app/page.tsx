import { QuickAdd } from "./_components/QuickAdd";
import { TitlesView } from "./_components/TitlesView";
import { serverClient } from "./_trpc/serverClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const titles = await serverClient.titles.getAll();
  return (
    <main className="container mx-auto mt-10 space-y-10">
      <QuickAdd />
      <TitlesView initialData={titles} />
    </main>
  );
}
