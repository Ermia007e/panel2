import { create } from 'zustand';

const useCourseStore = create((set) => ({
  levelName: "",
  techName: "",
  typeName: "",
  SearchInput: "",
  PageNumber: "1",
  SortingCol: "",
  SortingType: "ASC",
  CostUp: "1000000000",
  CostDown: "0",
  CardView: true,
  teacherId: null, 

  handlelevelName: (levelName) => set({ levelName }),
  handletechName: (techName) => set({ techName }),
  handletypeName: (typeName) => set({ typeName }),
  handleSearchInput: (SearchInput) => set({ SearchInput }),
  handlePageNumber: (PageNumber) => set({ PageNumber }),
  handleSortingCol: (SortingCol) => set({ SortingCol }),
  handleSortingType: (SortingType) => set({ SortingType }),
  handleCostUp: (CostUp) => set({ CostUp }),
  handleCostDown: (CostDown) => set({ CostDown }),
  handleCardView: (CardView) => set({ CardView }),
  setTeacherId: (id) => set({ teacherId: id }),

  handleClearAllFilters: () =>
    set({
      levelName: "",
      techName: "",
      typeName: "",
      CostUp: "1000000000",
      CostDown: "0",
    }),
}));

export default useCourseStore;
