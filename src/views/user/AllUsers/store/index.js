// ** Redux Imports
import { create } from "zustand";


// ** Zustand Store


export const useStore = create((set) => ({
  pageNumber: 1,
  setPageNumber: (pageNumber) => set({ pageNumber }),
}));


