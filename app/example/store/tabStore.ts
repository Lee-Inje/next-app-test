// /store/tabStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface TabState {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
}

export const useTabStore = create<TabState>()(
  immer((set) => ({
    selectedTab: 0,
    setSelectedTab: (index) => set((state) => { state.selectedTab = index; }),
  }))
);
