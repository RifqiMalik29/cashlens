import type { Dispatch, SetStateAction } from "react";

interface ResetFormParams {
  setAmount: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<"income" | "expense">>;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
  setDate: Dispatch<SetStateAction<string>>;
  setNote: Dispatch<SetStateAction<string>>;
  setReceiptUri: Dispatch<SetStateAction<string | undefined>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

const DEFAULT_AMOUNT = "";

export function resetForm({
  setAmount,
  setType,
  setSelectedCategoryId,
  setDate,
  setNote,
  setReceiptUri,
  setError
}: ResetFormParams) {
  setAmount(DEFAULT_AMOUNT);
  setType("expense");
  setSelectedCategoryId(null);
  setDate(new Date().toISOString());
  setNote("");
  setReceiptUri(undefined);
  setError(null);
}
