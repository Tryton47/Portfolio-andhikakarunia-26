import { create } from 'zustand';
import { CATEGORIES } from '../config/categories';

export const useLogoState = create((set) => ({
  activeCategory: CATEGORIES.DATA,
  selectedLogoId: null,
  isAutoPlay: false,

  setCategory: (cat) => set({ activeCategory: cat, selectedLogoId: null }),
  selectLogo: (id) => set((state) => ({
    selectedLogoId: state.selectedLogoId === id ? null : id,
  })),
  toggleAutoPlay: () => set((state) => ({ isAutoPlay: !state.isAutoPlay })),
}));
