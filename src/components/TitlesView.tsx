import type { ColumnDef } from "@tanstack/react-table";
import type { Title } from "~/db/drizzle";
import { api } from "~/utils/api";
import { DataTable } from "./ui/data-table";
import React from "react";
import { cn } from "../utils/utils";
import { CheckCircle, CircleDashed, YoutubeIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Link from "next/link";
import Image from "next/image";
import { DataTableLoader } from "./ui/data-table-loader";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { DataTableRowActions } from "./ui/data-table-row-actions";
import { Skeleton } from "./ui/skeleton";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-bold", className)} {...props} />
));
Header.displayName = "Header";

const columns: ColumnDef<Title>[] = [
  {
    accessorKey: "mediaType",
    header: () => <Header>Type</Header>,
    cell: ({ row }) => (
      <div className="w-[20px]">
        <Badge variant={row.getValue("mediaType")} className="uppercase">
          {row.getValue("mediaType")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <Header>Name</Header>,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex w-full flex-row space-x-2 font-bold hover:cursor-pointer">
                <span className="text-lg">{row.getValue("name")}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              className="w-[500px] bg-gray-900 text-white"
            >
              <div className="flex space-x-5">
                <div className="min-w-[200px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${row.original.tmdbPosterPath}`}
                    width={500}
                    height={500}
                    alt={`Movie poster of ${row.original.name}`}
                  />
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-extrabold">
                      {row.getValue("name")}
                    </h4>
                    <Badge variant="default" className="uppercase">
                      {row.original.mediaType}
                    </Badge>
                  </div>
                  <ScrollArea className="h-32">
                    {row.original.tmdbOverview}
                  </ScrollArea>
                  <div className="space-y-2">
                    <Separator />
                    <div>
                      <Link
                        href={`https://www.youtube.com/results?search_query=${row.original.name} Official Trailer`}
                        target="_blank"
                      >
                        <div className="flex flex-col items-center">
                          <YoutubeIcon className="h-10 w-10" />
                          <span className="text-[12px]">Trailer</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "genre",
    header: () => <Header>Genre</Header>,
    cell: ({ row }) => {
      return <div>{row.getValue("genre")}</div>;
    },
  },
  {
    accessorKey: "isWatched",
    header: () => <Header>Watched</Header>,
    cell: ({ row }) => {
      return (
        <div className="flex w-[50px] translate-x-1 justify-center">
          {!row.getValue("isWatched") ? (
            <CircleDashed className="text-red-500" />
          ) : (
            <CheckCircle className="text-green-500" />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { data: usersData } = api.users.getAll.useQuery();

      if (usersData) {
        return <DataTableRowActions row={row} userData={usersData} />;
      } else {
        return <Skeleton className="flex h-8 w-8 p-0" />;
      }
    },
  },
];

export function TitlesView() {
  const { data } = api.titles.getAll.useQuery();

  if (data) {
    return <DataTable data={data} columns={columns} />;
  } else {
    return <DataTableLoader columns={columns} numberOfSkeletons={7} />;
  }
}
