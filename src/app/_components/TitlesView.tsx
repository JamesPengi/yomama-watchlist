"use client";

import type { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { DataTable } from "~/app/_components/ui/data-table";
import React from "react";
import { cn } from "~/utils/utils";
import { CheckCircle, CircleDashed } from "lucide-react";
import { Badge } from "./ui/badge";
import { DataTableRowActions } from "./ui/data-table-row-actions";
import { Skeleton } from "./ui/skeleton";
import type { serverClient } from "../_trpc/serverClient";
import { trpc } from "../_trpc/client";
import type { getAllResponse } from "~/types/ApiResponses";

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
      return (
        <div className="flex justify-center">
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
        return <Skeleton className="flex h-8 w-8 rounded-full p-0" />;
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
    initialData: initialData,
  });

  return (
    <DataTable data={data} columns={columns} initialState={initialTableState} />
  );
}
