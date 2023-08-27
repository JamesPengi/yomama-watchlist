import type { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { Button } from "./button";
import { CheckCircleIcon, CircleDashedIcon, XCircleIcon } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search for your title..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="h-10 w-[150px] p-4 lg:w-[250px]"
        />

        {table.getColumn("isWatched") && (
          <DataTableFacetedFilter
            column={table.getColumn("isWatched")}
            title="Watched"
            options={[
              { label: "Watched", value: "true", icon: CheckCircleIcon },
              { label: "Not Watched", value: "false", icon: CircleDashedIcon },
            ]}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset <XCircleIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
