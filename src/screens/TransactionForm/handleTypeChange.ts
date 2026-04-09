import type { TransactionType } from "@types";
import type { Dispatch, SetStateAction } from "react";

interface Category {
  id: string;
  type: string;
}

interface UseTypeChangeParams {
  categories: Category[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
}

export function handleTypeChange({
  newType,
  categories,
  selectedCategoryId,
  setSelectedCategoryId
}: UseTypeChangeParams & { newType: TransactionType }) {
  const filtered = categories.filter(
    (cat) => cat.type === "both" || cat.type === newType
  );
  if (
    selectedCategoryId &&
    !filtered.some((c) => c.id === selectedCategoryId)
  ) {
    setSelectedCategoryId(null);
  }
}
