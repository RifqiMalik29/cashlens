import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { defaultCategories } from "@/constants/defaultCategories";
import { type Category } from "@/types";

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetToDefault: () => void;
  setCategories: (categories: Category[]) => void;
  _syncVersion: number;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      _syncVersion: 0,
      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
          _syncVersion: state._syncVersion + 1
        }));
      },
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
          _syncVersion: state._syncVersion + 1
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          _syncVersion: state._syncVersion + 1
        }));
      },
      resetToDefault: () => {
        set({
          categories: defaultCategories,
          _syncVersion: get()._syncVersion + 1
        });
      },
      setCategories: (categories) => {
        set({ categories, _syncVersion: get()._syncVersion + 1 });
      }
    }),
    {
      name: "category-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
