"use client";

import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { DataTable } from "~/app/_components/ui/data-table";
import React from "react";
import { cn } from "~/utils/utils";
import { Badge } from "./ui/badge";
import type { serverClient } from "../_trpc/serverClient";
import { trpc } from "../_trpc/client";
import type { getAllResponse } from "~/types/ApiResponses";
import { ToggleWatched } from "./ToggleWatched";
import { Skeleton } from "./ui/skeleton";

interface TitlesViewProps {
  initialTitleData: Awaited<
    ReturnType<(typeof serverClient)["titles"]["getAll"]>
  >;
  initialUserData: Awaited<
    ReturnType<(typeof serverClient)["users"]["getAll"]>
  >;
}

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-bold", className)} {...props} />
));
Header.displayName = "Header";

const columns: ColumnDef<getAllResponse>[] = [
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
        <div className="flex w-[600px] flex-row space-x-2 font-bold hover:cursor-pointer">
          <span className="text-lg">{row.getValue("name")}</span>
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
    header: () => <Header className="text-center">Watched</Header>,
    cell: ({ row }) => {
      const { data: userData } = trpc.users.getAll.useQuery();

      return (
        <div className="flex justify-center">
          {userData ? (
            <ToggleWatched
              titleId={row.original.id}
              titleName={row.original.name}
              isWatched={row.original.isWatched}
              userData={userData}
            />
          ) : (
            <Skeleton className="h-8 w-8" />
          )}
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
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

export function TitlesView({
  initialTitleData,
  initialUserData,
}: TitlesViewProps) {
  trpc.users.getAll.useQuery(undefined, {
    initialData: initialUserData,
  });

  const { data } = trpc.titles.getAll.useQuery(undefined, {
    initialData: initialTitleData,
  });

  return (
    <DataTable data={data} columns={columns} initialState={initialTableState} />
  );
}
