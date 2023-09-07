import { TitlesView } from "./_components/TitlesView";
import { serverClient } from "./_trpc/serverClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const titles = await serverClient.titles.getAll();
  return <TitlesView initialData={titles} />;
}
