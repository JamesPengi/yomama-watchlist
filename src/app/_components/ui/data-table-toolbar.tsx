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
import { useEffect, useRef } from "react";
import { useFilterStore } from "~/utils/store";

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

  const filterRef = useRef(null);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (filterRef.current) {
        if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          // @ts-expect-error I'm unsure how to type the ref, but this should always work
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          filterRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [filterRef]);

  const filterStore = useFilterStore();
  useEffect(() => {
    table
      .getColumn("isWatched")
      ?.setFilterValue(
        filterStore.isWatched.size
          ? Array.from(filterStore.isWatched)
          : undefined
      );
    table
      .getColumn("mediaType")
      ?.setFilterValue(
        filterStore.mediaType.size
          ? Array.from(filterStore.mediaType)
          : undefined
      );
    table
      .getColumn("genre")
      ?.setFilterValue(
        filterStore.genre.size ? Array.from(filterStore.genre) : undefined
      );
    table
      .getColumn("watchedBy")
      ?.setFilterValue(
        filterStore.watchedBy.size
          ? Array.from(filterStore.watchedBy)
          : undefined
      );
    table
      .getColumn("notWatchedBy")
      ?.setFilterValue(
        filterStore.notWatchedBy.size
          ? Array.from(filterStore.notWatchedBy)
          : undefined
      );
  }, [
    filterStore.isWatched,
    filterStore.mediaType,
    filterStore.genre,
    filterStore.watchedBy,
    filterStore.notWatchedBy,
    table,
  ]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          ref={filterRef}
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
            filterState={filterStore.isWatched}
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
            filterState={filterStore.mediaType}
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
            filterState={filterStore.genre}
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
                filterState={filterStore.watchedBy}
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
                filterState={filterStore.notWatchedBy}
              />
            )}
          </>
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              filterStore.clearFilters();
            }}
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
