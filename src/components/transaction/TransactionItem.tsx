import { type Category, type Transaction } from "@types";
import { formatCurrency } from "@utils/formatCurrency";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface TransactionItemProps {
  transaction: Transaction;
  category: Category | undefined;
  onPress?: () => void;
  baseCurrency: string;
}

export function TransactionItem({
  transaction,
  category,
  onPress,
  baseCurrency
}: TransactionItemProps) {
  const amountColor = transaction.type === "expense" ? "#EF4444" : "#10B981";
  const amountPrefix = transaction.type === "expense" ? "-" : "+";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white"
      activeOpacity={0.7}
    >
      <View
        className="items-center justify-center rounded-full mr-3"
        style={{
          width: 44,
          height: 44,
          backgroundColor: category?.color ?? "#E5E7EB"
        }}
      >
        <Typography variant="h4" weight="bold" color="#FFFFFF">
          {category ? category.name.charAt(0).toUpperCase() : "?"}
        </Typography>
      </View>

      <View className="flex-1">
        <Typography variant="body" weight="medium" numberOfLines={1}>
          {category?.name ?? "Unknown"}
        </Typography>
        {transaction.note ? (
          <Typography
            variant="caption"
            color="#6B7280"
            numberOfLines={1}
            style={{ marginTop: 2 }}
          >
            {transaction.note}
          </Typography>
        ) : null}
      </View>

      <View className="items-end">
        <Typography variant="body" weight="semibold" color={amountColor}>
          {amountPrefix}{" "}
          {formatCurrency(
            Math.abs(transaction.amountInBaseCurrency),
            baseCurrency
          )}
        </Typography>
        <Typography variant="caption" color="#9CA3AF" style={{ marginTop: 2 }}>
          {new Date(transaction.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
