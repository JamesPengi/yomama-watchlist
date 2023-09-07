import { serverClient } from "~/app/_trpc/serverClient";
import TitleCard from "./TitleCard";

export const runtime = "edge";

export default async function TitleView({
  params: { id },
}: {
  params: { id: string };
}) {
  const title = await serverClient.titles.getOne(id);

  return <TitleCard titleId={id} initialData={title} />;
}
