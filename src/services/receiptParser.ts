import { type Transaction } from "@/types";

export const receiptParser = {
  parse: (_text: string): Partial<Transaction> => {
    return {};
  }
};
