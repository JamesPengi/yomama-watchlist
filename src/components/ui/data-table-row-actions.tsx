import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./dropdown-menu";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { api } from "~/utils/api";
import { Button } from "./button";
import { Title } from "~/db/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const title = row.original as Title;
  const queryContext = api.useContext();
  const toggleWatched = api.titles.toggleWatched.useMutation({
    onSuccess() {
      queryContext.titles.invalidate();
    },
  });
  const deleteTitle = api.titles.delete.useMutation({
    onSuccess() {
      queryContext.titles.invalidate();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel className="font-sans">
          Title Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-sans"
          onClick={() =>
            toggleWatched.mutate({
              name: title.name,
              isWatched: title.isWatched,
            })
          }
        >
          Mark as {title.isWatched ? `not watched` : `watched`}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 focus:bg-red-500 focus:text-white"
          onClick={() => deleteTitle.mutate(title.name)}
        >
          Delete title
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
