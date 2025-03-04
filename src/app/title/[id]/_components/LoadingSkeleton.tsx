import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/app/_components/ui/card";
import Image from "next/image";
import { Separator } from "~/app/_components/ui/separator";

import { Skeleton } from "~/app/_components/ui/skeleton";
import tmdbIcon from "~/assets/tmdb_logo.svg";

export function TitleLoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col">
        <div className="flex flex-col justify-center space-y-2">
          <Skeleton className="h-8" />
          <div className="flex justify-center">
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <Separator />
        <div className="mb-10 flex flex-col space-y-5">
          {/* Overview */}
          <div>
            <Skeleton className="h-32" />
          </div>
          {/* Actor */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-3/4" />
          </div>
          {/* Director */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-3/4" />
          </div>
        </div>
        {/* Added on and Mark as Watched Button*/}
        <div className="flex flex-row justify-between space-x-5">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between space-y-0">
        <div className="flex flex-row space-x-2">
          <span>Powered by</span>
          <Image
            // Cannot assign tmdbIcon to a type because it's a svg file
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={tmdbIcon}
            alt="Powered by TMDB"
            width={50}
          />
        </div>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
