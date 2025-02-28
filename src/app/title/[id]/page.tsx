import { serverClient } from "~/app/_trpc/serverClient";
import TitleCard from "./TitleCard";

export default async function TitleView(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const title = await serverClient.titles.getOne(id);

  return <TitleCard titleId={id} initialData={title} />;
}

export const dynamic = "force-dynamic";
