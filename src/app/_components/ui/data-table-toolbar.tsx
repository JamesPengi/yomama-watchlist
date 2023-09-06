"use client";

import type { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { Button } from "./button";
import {
  BrushIcon,
  CheckCircleIcon,
  CircleDashedIcon,
  ClapperboardIcon,
  DicesIcon,
  TvIcon,
  XCircleIcon,
} from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { trpc } from "~/app/_trpc/client";
import {
  tmdbGenreNameEnum,
  type tmdbGenreName,
  type tmdbMediaType,
  tmdbMediaTypeEnum,
} from "~/types/tmdbSchema";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { data: usersData } = trpc.users.getAll.useQuery();
  const getRandomMovieMutation = trpc.titles.getRandom.useMutation({
    onSuccess(data) {
      table.getColumn("name")?.setFilterValue(data?.name);
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;
  const isWatchedFiltered = table.getState().columnFilters.find((value) => {
    // @ts-expect-error value.value of the row 'isWatched' is always an array in this implementation
    if (value.id === "isWatched" && value.value[0] === "true") {
      return true;
    }
  });
  const isNotWatchedFiltered = table.getState().columnFilters.find((value) => {
    // @ts-expect-error value.value of the row 'isWatched' is always an array in this implementation
    if (value.id === "isWatched" && value.value[0] === "false") {
      return true;
    }
  });

  const getRandomMovie = () => {
    const types = table
      .getState()
      .columnFilters.find((value) => value.id === "mediaType");
    const genres = table
      .getState()
      .columnFilters.find((value) => value.id === "genre");

    getRandomMovieMutation.mutate({
      type: types
        ? (types.value as tmdbMediaType[])
        : tmdbMediaTypeEnum.options,
      genre: genres
        ? (genres.value as tmdbGenreName[])
        : tmdbGenreNameEnum.options,
    });
  };

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
            options={tmdbGenreNameEnum.options.map((genre) => {
              return {
                label: genre,
                value: genre,
              };
            })}
          />
        )}

        {isWatchedFiltered && (
          <>
            {table.getColumn("watchedBy") && usersData && (
              <DataTableFacetedFilter
                column={table.getColumn("watchedBy")}
                title="Watched by"
                options={usersData.map((user) => {
                  return {
                    label: user.name,
                    value: user.name,
                  };
                })}
              />
            )}
          </>
        )}

        {!isWatchedFiltered && !isNotWatchedFiltered && (
          <>
            {table.getColumn("notWatchedBy") && usersData && (
              <DataTableFacetedFilter
                column={table.getColumn("notWatchedBy")}
                title="Not watched by"
                options={usersData.map((user) => {
                  return {
                    label: user.name,
                    value: user.name,
                  };
                })}
              />
            )}
          </>
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
      {isNotWatchedFiltered && (
        <Button variant="secondary" onClick={getRandomMovie}>
          Get Random Title <DicesIcon className="ml-2" />
        </Button>
      )}
    </div>
  );
}
