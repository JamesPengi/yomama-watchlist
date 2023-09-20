"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "~/app/_trpc/client";
import { Badge } from "./badge";
import Image from "next/image";
import { toBase64, shimmer } from "~/utils/ImageShimmer";

interface SearchSuggestionsProps {
  searchText: string;
  mutationFn: (name: string) => void;
}

export function SearchSuggestions({
  searchText,
  mutationFn,
}: SearchSuggestionsProps) {
  const { data, mutate } = trpc.titles.search.useMutation({
    onMutate() {
      toggleShowSuggestions(false);
    },
    onSuccess() {
      toggleShowSuggestions(true);
    },
  });
  const debouncedSearch = useDebouncedCallback(() => {
    mutate(searchText);
  }, 350);

  const [showSuggestions, toggleShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    if (searchText !== "" && searchText.length > 1) {
      debouncedSearch();
    } else {
      toggleShowSuggestions(false);
    }
  }, [searchText, debouncedSearch]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleShowSuggestions(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    data && (
      <div
        className={`absolute z-10 flex h-[500px] w-full flex-col space-y-2 overflow-y-scroll rounded rounded-t-none bg-gray-800 px-2 drop-shadow-sm ${
          !showSuggestions ? `hidden` : `visible`
        }`}
      >
        {data.map((suggestion, index) => {
          return (
            <div
              key={index}
              onClick={() => mutationFn(suggestion.searchableTitle)}
              className="flex flex-row space-x-2 border-b p-1 transition-colors hover:cursor-pointer hover:bg-gray-700"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w92${suggestion.posterPath}`}
                width={92}
                height={138}
                alt={`Movie poster of ${suggestion.title}`}
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(92, 138)
                )}`}
              />
              <div className="space-y-3 overflow-hidden">
                <div>
                  <p className="font-bold">
                    {suggestion.title}{" "}
                    <span className="font-light">
                      ({suggestion.releaseDate})
                    </span>
                  </p>
                  <Badge variant={suggestion.mediaType}>
                    {suggestion.mediaType}
                  </Badge>
                </div>
                <p className="text-sm font-semibold">{suggestion.genre}</p>
                <p className="truncate text-sm">{suggestion.overview}</p>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
}
