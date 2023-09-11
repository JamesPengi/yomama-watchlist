import { create } from "zustand";

type TableStore = {
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  increasePageIndex: () => void;
  decreasePageIndex: () => void;
};

export const useTableStore = create<TableStore>()((set) => ({
  pageIndex: 0,
  setPageIndex: (pageIndex) => set(() => ({ pageIndex: pageIndex })),
  increasePageIndex: () => set((state) => ({ pageIndex: state.pageIndex + 1 })),
  decreasePageIndex: () => set((state) => ({ pageIndex: state.pageIndex - 1 })),
}));
