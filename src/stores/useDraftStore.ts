import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface DraftTransaction {
  id: string;
  source: string;
  amount: number;
  currency: string;
  description: string;
  descriptionParams?: Record<string, string>;
  type: "income" | "expense";
  date: string;
  status: "pending" | "confirmed" | "dismissed";
}

interface DraftState {
  drafts: DraftTransaction[];
  addDraft: (draft: Omit<DraftTransaction, "id" | "status">) => void;
  confirmDraft: (id: string) => void;
  dismissDraft: (id: string) => void;
  clearAll: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      drafts: [],
      addDraft: (draft) =>
        set((state) => ({
          drafts: [
            {
              ...draft,
              id: Math.random().toString(36).substring(7),
              status: "pending"
            },
            ...state.drafts
          ]
        })),
      confirmDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, status: "confirmed" } : d
          )
        })),
      dismissDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, status: "dismissed" } : d
          )
        })),
      clearAll: () => set({ drafts: [] })
    }),
    {
      name: "cashlens-draft-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
