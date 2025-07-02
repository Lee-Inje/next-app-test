import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import { Draft } from "immer";

export interface WithId {
  _id: string;
}

export interface ListStore<T extends WithId > {
  items: T[];
  setItems: (items: Partial<T>[]) => void;
  append: (item: Partial<T>) => void;
  update: <K extends keyof T>(id: string, key: K, value: T[K]) => void;
  updateItem : (id:string , t: Partial<T>) => void;
  remove: (id: string) => void;
  swap: (id1: string, id2: string) => void;
  moveTo: (id: string, toIndex: number) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  clear: () => void;
}

export function createListStore<T extends WithId>() {
  return createStore<ListStore<T>>()(
    immer((set, get) => ({
      items: [],

      setItems: (newItems) =>
        set(() => ({
          items: newItems.map((item) => ({ ...item, _id: uuidv4() })),
        })),

      append: (item: Partial<T>) =>
            set((state) => {
              (state.items as Partial<T>[]).push({...item , _id : uuidv4()});
        }),

      update: (id, key, value) =>
        set((state) => {
          const idx = state.items.findIndex((item) => item._id === id);
          if (idx !== -1) {
            (state.items[idx] as any)[key] = value;
          }
        }),
      updateItem: (id, partial) =>
        set((state) => {
            const idx = state.items.findIndex((item) => item._id === id);
            if (idx !== -1) {
                Object.assign(state.items[idx], partial);
            }
        }),
      remove: (id) =>
        set((state) => {
          state.items = state.items.filter((item) => item._id !== id);
        }),

      swap: (id1, id2) =>
        set((state) => {
          const idx1 = state.items.findIndex((item) => item._id === id1);
          const idx2 = state.items.findIndex((item) => item._id === id2);
          if (idx1 !== -1 && idx2 !== -1) {
            [state.items[idx1], state.items[idx2]] = [
              state.items[idx2],
              state.items[idx1],
            ];
          }
        }),

      moveTo: (id, toIndex) => {
        set((state) => {
          const idx = state.items.findIndex((item) => item._id === id);
          if (idx !== -1 && toIndex >= 0 && toIndex < state.items.length) {
            const [movedItem] = state.items.splice(idx, 1);
            state.items.splice(toIndex, 0, movedItem);
          }
        });
      },

      moveUp: (id) => {
        const { items, moveTo } = get();
        const idx = items.findIndex((item) => item._id === id);
        if (idx > 0) moveTo(id, idx - 1);
      },

      moveDown: (id) => {
        const { items, moveTo } = get();
        const idx = items.findIndex((item) => item._id === id);
        if (idx !== -1 && idx < items.length - 1) moveTo(id, idx + 1);
      },

      clear: () =>
        set(() => ({
          items: [],
        })),

    }))
  );
}
