import type { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { Button } from "./button";
import {
  BrushIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  ClapperboardIcon,
  TvIcon,
  XCircleIcon,
} from "lucide-react";
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

        {table.getColumn("mediaType") && (
          <DataTableFacetedFilter
            column={table.getColumn("mediaType")}
            title="Type"
            options={[
              { label: "Movie", value: "movie", icon: ClapperboardIcon },
              { label: "TV", value: "tv", icon: TvIcon },
              { label: "Anime", value: "anime", icon: BrushIcon },
            ]}
          />
        )}

        {table.getColumn("genre") && (
          <DataTableFacetedFilter
            column={table.getColumn("genre")}
            title="Genre"
            options={[
              "Action",
              "Action & Adventure",
              "Adventure",
              "Animation",
              "Comedy",
              "Crime",
              "Documentary",
              "Drama",
              "Family",
              "Fantasy",
              "History",
              "Horror",
              "Kids",
              "Music",
              "Mystery",
              "News",
              "Reality",
              "Romance",
              "Sci-Fi & Fantasy",
              "Science Fiction",
              "Soap",
              "Talk",
              "TV Movie",
              "Thriller",
              "War",
              "War & Politics",
              "Western",
              "Unknown",
            ].map((genre) => {
              return {
                label: genre,
                value: genre,
              };
            })}
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
