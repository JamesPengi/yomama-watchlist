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
