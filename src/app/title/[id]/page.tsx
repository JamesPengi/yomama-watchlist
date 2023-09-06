"use client";

import {
  CheckCircle,
  CircleDashed,
  CodesandboxIcon,
  ExternalLinkIcon,
  YoutubeIcon,
} from "lucide-react";
import tmdbIcon from "~/assets/tmdb_logo.svg";
import Image from "next/image";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import LinkWithIcon from "~/app/_components/ui/link-with-icon";
import { Separator } from "~/app/_components/ui/separator";
import { trpc } from "~/app/_trpc/client";
import { toBase64, shimmer } from "~/utils/ImageShimmer";

export default function TitleView({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data, isLoadingError } = trpc.titles.getOne.useQuery(id);
  if (!data) {
    return <div>Loading... (insert skeleton here)</div>;
  }

  if (isLoadingError) {
    return <div>Error... could not find your title</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-3xl font-extrabold">
            {data.title}{" "}
            <span className="text-xl font-light text-muted-foreground">
              ({data.releaseDate})
            </span>
          </CardTitle>
          <CardDescription>
            <Badge variant={data.mediaType}>{data.mediaType}</Badge>
          </CardDescription>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {data.isWatched ? (
            <>
              <CheckCircle className="text-green-500" />
              <span>Watched</span>
            </>
          ) : (
            <>
              <CircleDashed className="text-red-500" />
              <span>Not Watched</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-row space-x-5">
        <div className="min-w-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${data.posterPath}`}
            width={500}
            height={750}
            alt={`Movie poster of ${data.title}`}
            placeholder={`data:image/svg+xml;base64,${toBase64(
              shimmer(200, 300)
            )}`}
          />
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex h-1/2 flex-row space-x-2">
            <div className="flex flex-col space-y-5">
              <span className="text-center text-xl font-semibold italic">
                {data.tagline}
              </span>
              <Separator />
              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Overview
                </h5>
                <p>{data.overview}</p>
              </div>
              {data.credits.actors[0] && (
                <div>
                  <h5 className="text-muted-foreground underline underline-offset-4">
                    Cast
                  </h5>
                  <div className="flex flex-row space-x-5">
                    {data.credits.actors.map((actor, index) => {
                      return <span key={index}>{actor.name}</span>;
                    })}
                  </div>
                </div>
              )}
              {data.credits.directors[0] && (
                <div>
                  <h5 className="text-muted-foreground underline underline-offset-4">
                    Director
                  </h5>
                  <div className="flex flex-row space-x-5">
                    {data.credits.directors.map((director, index) => {
                      return <span key={index}>{director}</span>;
                    })}
                  </div>
                </div>
              )}
              {data.credits.writers[0] && (
                <div>
                  <h5 className="text-muted-foreground underline underline-offset-4">
                    Writers
                  </h5>
                  <div className="flex flex-row space-x-5">
                    {data.credits.writers.map((writer, index) => {
                      return <span key={index}>{writer}</span>;
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row space-x-5">
              <Separator orientation="vertical" />
              <div className="flex h-auto flex-col space-y-5">
                <h5 className="font-bold">Links</h5>
                <LinkWithIcon
                  link={`https://www.youtube.com/results?search_query=${data.title} Official Trailer`}
                  Icon={YoutubeIcon}
                  textUnderIcon="Trailer"
                />
                <LinkWithIcon
                  link={`https://www.imdb.com/${data.imdbLink}`}
                  Icon={CodesandboxIcon}
                  textUnderIcon="IMDB"
                />
                {data.homepage && (
                  <LinkWithIcon
                    link={data.homepage}
                    Icon={ExternalLinkIcon}
                    textUnderIcon="Website"
                  />
                )}
              </div>
            </div>
          </div>
          {data.userData && (
            <div className="flex h-1/2 flex-col space-y-3">
              <h3 className="text-center text-2xl font-bold">Review</h3>
              <Separator />
              <div className="flex flex-col space-y-5">
                <div className="flex flex-row justify-center">
                  <span className="text-center text-3xl font-extrabold">
                    {data.userData.rating}
                  </span>
                </div>
                <div className="flex flex-row justify-center space-x-2">
                  <span className="text-center text-xl font-semibold italic">
                    &quot;{data.userData.description}&quot;
                  </span>
                </div>
                <div>
                  <h5 className="text-muted-foreground underline underline-offset-4">
                    Watched by
                  </h5>
                  <div className="space-x-5">
                    {data.userData.watched.map((user, index) => {
                      return <span key={index}>{user}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between space-y-0">
        <div className="flex flex-row space-x-2">
          <span>Powered by</span>
          <Image
            // Cannot asign tmdbIcon to a type because it's an svg file
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={tmdbIcon}
            alt="Powered by TMDB"
            width={75}
          />
        </div>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}
