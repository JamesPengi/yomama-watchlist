"use client";

import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import type { tmdbGenreName } from "~/utils/tmdbSchema";
import { DataTable } from "~/app/_components/ui/data-table";
import React from "react";
import { cn } from "~/utils/utils";
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
import type { serverClient } from "../_trpc/serverClient";
import { trpc } from "../_trpc/client";

interface TitlesViewProps {
  initialData: Awaited<ReturnType<(typeof serverClient)["titles"]["getAll"]>>;
}

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-bold", className)} {...props} />
));
Header.displayName = "Header";

const columns: ColumnDef<{
  id: number;
  tmdbId: string;
  tmdbPosterPath: string;
  tmdbOverview: string;
  name: string;
  genre: tmdbGenreName;
  mediaType: "movie" | "tv" | "anime";
  dateAdded: Date;
  isWatched: boolean;
  dateWatched: Date;
  userDescriptoin: string;
  userRating: string;
  titlesToUsers: {
    user?: {
      name: string;
    };
  }[];
}>[] = [
  {
    accessorKey: "mediaType",
    header: () => <Header>Type</Header>,
    cell: ({ row }) => (
      <Badge variant={row.getValue("mediaType")} className="uppercase">
        {row.getValue("mediaType")}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "name",
    header: () => <Header>Name</Header>,
    cell: ({ row }) => {
      return (
        <div className="flex">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex w-[400px] flex-row space-x-2 font-bold hover:cursor-pointer">
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
      return <div className="w-[150px]">{row.getValue("genre")}</div>;
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "isWatched",
    accessorFn: ({ isWatched }) => {
      if (isWatched) {
        return "true";
      } else {
        return "false";
      }
    },
    header: () => <Header>Watched</Header>,
    cell: ({ row }) => {
      return (
        <div className="flex w-[50px] translate-x-1.5 justify-center">
          {row.getValue("isWatched") === "false" ? (
            <CircleDashed className="text-red-500" />
          ) : (
            <CheckCircle className="text-green-500" />
          )}
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { data: usersData } = trpc.users.getAll.useQuery();

      if (usersData) {
        return <DataTableRowActions row={row} userData={usersData} />;
      } else {
        return <Skeleton className="flex h-8 w-8 p-0" />;
      }
    },
  },
  {
    id: "watchedBy",
    accessorFn: ({ titlesToUsers }) => {
      return titlesToUsers.map(({ user }) => {
        if (user) {
          return user.name;
        } else {
          return null;
        }
      });
    },
    filterFn: (row, id, value: string[]) => {
      const data: string[] = row.getValue(id);
      for (const rowData of data) {
        for (const rowValue of value) {
          if (rowData === rowValue) {
            return true;
          }
        }
      }
      return false;
    },
  },
  {
    id: "notWatchedBy",
    accessorFn: ({ titlesToUsers }) => {
      return titlesToUsers.map(({ user }) => {
        if (user) {
          return user.name;
        } else {
          return null;
        }
      });
    },
    filterFn: (row, id, value: string[]) => {
      const data: string[] = row.getValue(id);
      for (const rowData of data) {
        for (const rowValue of value) {
          if (rowData === rowValue) {
            return false;
          }
        }
      }
      return true;
    },
  },
];

const initialTableState: InitialTableState = {
  columnVisibility: {
    watchedBy: false,
    notWatchedBy: false,
  },
};

export function TitlesView({ initialData }: TitlesViewProps) {
  const { data } = trpc.titles.getAll.useQuery(undefined, {
    // @ts-expect-error Stupid date string incompatibility
    initialData: initialData,
  });

  if (data) {
    return (
      <DataTable
        data={data}
        // @ts-expect-error TS says that the types don't match, but it still works.
        columns={columns}
        initialState={initialTableState}
      />
    );
  } else {
    return (
      <DataTableLoader
        columns={columns}
        numberOfSkeletons={7}
        initialState={initialTableState}
      />
    );
  }
}
