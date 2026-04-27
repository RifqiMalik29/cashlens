export type TransactionType = "income" | "expense";
export type BudgetPeriod = "weekly" | "monthly" | "yearly";
export type CategoryType = "income" | "expense" | "both";

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  amountInBaseCurrency: number;
  exchangeRate: number;
  type: TransactionType;
  categoryId: string | null;
  note: string;
  date: string;
  receiptImageUri?: string;
  isFromScan: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameKey: string | null;
  icon: string;
  color: string;
  isDefault: boolean;
  isCustom: boolean;
  type: CategoryType;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;
  endDate?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface UserPreferences {
  baseCurrency: string;
  theme: "light" | "dark" | "system";
  language: string;
  createdAt: string;
}

export interface SettingsDialogState {
  isVisible: boolean;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  primaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}
