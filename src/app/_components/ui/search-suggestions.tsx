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

  return (
    data && (
      <div
        className={`absolute z-20 flex flex-col space-y-5 rounded rounded-t-none bg-gray-900 ${
          !showSuggestions && `hidden`
        }`}
      >
        {data.map((suggestion, index) => {
          return (
            <div
              key={index}
              onClick={() => mutationFn(suggestion.title)}
              className="flex flex-row space-x-2 border-b p-2 transition-colors hover:cursor-pointer hover:bg-muted/50"
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
              <div className="space-y-3">
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
                <p className="max-w-prose truncate text-sm">
                  {suggestion.overview}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
}
