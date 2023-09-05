import { TitlesView } from "./_components/TitlesView";
import { serverClient } from "./_trpc/serverClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const titles = await serverClient.titles.getAll();
  return (
    <main className="space-y-10">
      <TitlesView initialData={titles} />
    </main>
  );
}
