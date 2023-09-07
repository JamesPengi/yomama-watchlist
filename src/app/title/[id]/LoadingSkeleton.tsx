import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/app/_components/ui/card";
import Image from "next/image";
import { Separator } from "~/app/_components/ui/separator";

import { Skeleton } from "~/app/_components/ui/skeleton";
import { toBase64, shimmer } from "~/utils/ImageShimmer";
import tmdbIcon from "~/assets/tmdb_logo.svg";

export function TitleLoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <div className="flex w-1/3 flex-col space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-row space-x-5">
        <div className="min-w-[500px]">
          <Image
            src={`data:image/svg+xml;base64,${toBase64(shimmer(200, 300))}`}
            width={500}
            height={750}
            alt={`Loading title`}
          />
        </div>
        <div className="flex w-full flex-col space-y-7">
          <div className="flex h-1/2 flex-row space-x-2">
            <div className="flex w-full flex-col space-y-3">
              <Skeleton className="h-8 w-full" />
              <Separator />
              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Overview
                </h5>
                <Skeleton className="h-8 w-full rounded-none" />
                <Skeleton className="h-8 w-full rounded-none" />
                <Skeleton className="h-8 w-full rounded-none" />
              </div>
              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Cast
                </h5>
                <div className="flex flex-row space-x-5">
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>

              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Director
                </h5>
                <div className="flex flex-row space-x-5">
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>

              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Writers
                </h5>
                <div className="flex flex-row space-x-5">
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>

              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Added on
                </h5>
                <Skeleton className="h-8 w-1/3" />
              </div>
            </div>
            <div className="flex flex-row space-x-5">
              <Separator orientation="vertical" />
              <div className="flex h-auto flex-col space-y-5">
                <h5 className="font-bold">Links</h5>
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          <div className="flex h-1/2 flex-col space-y-3">
            <h3 className="text-center text-2xl font-bold">Review</h3>
            <Separator />
            <div className="flex flex-col space-y-5">
              <div className="flex flex-row justify-center">
                <Skeleton className="h-8 w-1/12" />
              </div>
              <div className="flex flex-row justify-center space-x-2">
                <Skeleton className="h-8 w-1/3" />
              </div>
              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Watched by
                </h5>
                <div className="space-x-5">
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
              <div>
                <h5 className="text-muted-foreground underline underline-offset-4">
                  Watched on
                </h5>
                <Skeleton className="h-8 w-1/3" />
              </div>
            </div>
          </div>
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
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
