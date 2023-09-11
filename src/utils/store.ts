import { create } from "zustand";

type PaginationStore = {
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  increasePageIndex: () => void;
  decreasePageIndex: () => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
};

export const usePaginationStore = create<PaginationStore>()((set) => ({
  pageIndex: 0,
  setPageIndex: (pageIndex) => set(() => ({ pageIndex: pageIndex })),
  increasePageIndex: () => set((state) => ({ pageIndex: state.pageIndex + 1 })),
  decreasePageIndex: () => set((state) => ({ pageIndex: state.pageIndex - 1 })),
  pageSize: 10,
  setPageSize: (pageSize) => set(() => ({ pageSize: pageSize })),
}));

type FilterStore = {
  isWatched: Set<string>;
  mediaType: Set<string>;
  genre: Set<string>;
  watchedBy: Set<string>;
  notWatchedBy: Set<string>;
  clearFilters: () => void;
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  isWatched: new Set(),
  mediaType: new Set(),
  genre: new Set(),
  watchedBy: new Set(),
  notWatchedBy: new Set(),
  clearFilters: () => {
    get().isWatched.clear();
    get().mediaType.clear();
    get().genre.clear();
    get().watchedBy.clear();
    get().notWatchedBy.clear();
  },
}));
