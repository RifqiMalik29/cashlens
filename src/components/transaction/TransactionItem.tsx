import { useColors } from "@hooks/useColors";
import { type Category, type Transaction } from "@types";
import { formatCurrency } from "@utils/formatCurrency";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const colors = useColors();
  const amountColor = transaction.type === "expense" ? "#EF4444" : "#10B981";
  const isUncategorized = !transaction.categoryId || !category;
  const amountPrefix = transaction.type === "expense" ? "-" : "+";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3"
      style={{ backgroundColor: colors.surface }}
      activeOpacity={0.7}
    >
      <View
        className="items-center justify-center rounded-full mr-3"
        style={{
          width: 44,
          height: 44,
          backgroundColor: isUncategorized
            ? "#E5E7EB"
            : category?.color || "#9CA3AF"
        }}
      >
        <Typography
          variant="h4"
          weight="bold"
          color={isUncategorized ? "#9CA3AF" : "#FFFFFF"}
        >
          {isUncategorized
            ? "?"
            : (category?.name || "").charAt(0).toUpperCase()}
        </Typography>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Typography variant="body" weight="medium" numberOfLines={1}>
            {isUncategorized ? t("transactions.uncategorized") : category?.name}
          </Typography>
          {isUncategorized && (
            <View
              className="px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <Typography variant="caption" color="#D97706" weight="medium">
                !
              </Typography>
            </View>
          )}
        </View>
        {transaction.note ? (
          <Typography
            variant="caption"
            color={colors.textSecondary}
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
        <Typography
          variant="caption"
          color={colors.textSecondary}
          style={{ marginTop: 2 }}
        >
          {new Date(transaction.date).toLocaleDateString(
            i18n.language === "id" ? "id-ID" : "en-US",
            {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            }
          )}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
