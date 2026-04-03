import { type TransactionType } from "@types";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface TypeSelectorProps {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export function TypeSelector({ type, onTypeChange }: TypeSelectorProps) {
  return (
    <View className="flex-row rounded-lg bg-surface-secondary p-1 mb-6">
      <TouchableOpacity
        onPress={() => onTypeChange("expense")}
        className={`flex-1 items-center justify-center py-3 rounded-md ${
          type === "expense" ? "bg-white" : ""
        }`}
        activeOpacity={0.7}
      >
        <Typography
          variant="body"
          weight="semibold"
          color={type === "expense" ? "#EF4444" : "#6B7280"}
        >
          Pengeluaran
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTypeChange("income")}
        className={`flex-1 items-center justify-center py-3 rounded-md ${
          type === "income" ? "bg-white" : ""
        }`}
        activeOpacity={0.7}
      >
        <Typography
          variant="body"
          weight="semibold"
          color={type === "income" ? "#10B981" : "#6B7280"}
        >
          Pemasukan
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
