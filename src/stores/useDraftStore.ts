import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface DraftTransaction {
  id: string;
  backendId?: string;
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
  addDraft: (draft: Omit<DraftTransaction, "id" | "status">) => string;
  setBackendId: (localId: string, backendId: string) => void;
  confirmDraft: (id: string) => void;
  dismissDraft: (id: string) => void;
  clearAll: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      drafts: [],
      addDraft: (draft) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          drafts: [{ ...draft, id, status: "pending" }, ...state.drafts]
        }));
        return id;
      },
      setBackendId: (localId, backendId) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === localId ? { ...d, backendId } : d
          )
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
