import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ObjectStore<T extends {}> {
  data: Partial<T>;
  set: (updater: Partial<T>) => void;
  reset: () => void;
}

export function createFormObjectStore<T extends {}>(initialState: Partial<T>) {
  return create<ObjectStore<T>>()(
    immer((set) => ({
      data: initialState ,
      set: (updater) =>
        set((state) => {
          Object.assign(state.data, updater);
        }),
      reset: () =>
        set((state) => {
          (state.data as Partial<T>) = {}
        }),
    }))
  );
}
