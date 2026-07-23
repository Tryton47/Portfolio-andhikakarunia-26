import { create } from 'zustand';

export const useLogoState = create((set) => ({
  // null = show all logos
  activeCategory: null,
  selectedLogoId: null,

  setCategory: (cat) => set({ activeCategory: cat, selectedLogoId: null }),
  selectLogo: (id) => set((state) => ({
    selectedLogoId: state.selectedLogoId === id ? null : id,
  })),
}));
