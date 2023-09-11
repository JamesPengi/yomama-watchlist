import { TitlesView } from "./_components/TitlesView";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const titles = await serverClient.titles.getAll();
  const users = await serverClient.users.getAll();

  return <TitlesView initialTitleData={titles} initialUserData={users} />;
}

export const dynamic = "force-dynamic";
