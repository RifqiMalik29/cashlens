import { type Transaction } from "@types";
import { formatCurrency } from "@utils/formatCurrency";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: { id: string; name: string; color: string }[];
  baseCurrency: string;
}

export function RecentTransactions({
  transactions,
  categories,
  baseCurrency
}: RecentTransactionsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSeeAll = () => {
    router.push("/(tabs)/transactions");
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <View className="mx-4">
      <View className="flex-row items-center justify-between mb-3">
        <Typography variant="h4" weight="semibold">
          {t("dashboard.recentTransactions")}
        </Typography>
        <TouchableOpacity onPress={handleSeeAll}>
          <Typography variant="caption" weight="semibold" color="#4CAF82">
            {t("dashboard.seeAll")}
          </Typography>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg overflow-hidden">
        {transactions.slice(0, 5).map((transaction, index) => {
          const category = getCategory(transaction.categoryId);
          const amountColor =
            transaction.type === "income" ? "#10B981" : "#EF4444";
          const amountPrefix = transaction.type === "income" ? "+" : "-";

          return (
            <View
              key={transaction.id}
              className={`flex-row items-center px-4 py-3 ${
                index < transactions.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: category?.color || "#E5E7EB" }}
              >
                <Typography variant="caption" color="#FFFFFF" weight="medium">
                  {category?.name.charAt(0) || "T"}
                </Typography>
              </View>

              <View className="flex-1">
                <Typography variant="body" weight="medium" numberOfLines={1}>
                  {category?.name || t("transactions.title")}
                </Typography>
                <Typography variant="caption" color="#6B7280" numberOfLines={1}>
                  {new Date(transaction.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short"
                  })}
                </Typography>
              </View>

              <Typography
                variant="body"
                weight="semibold"
                color={amountColor}
                numberOfLines={1}
              >
                {amountPrefix}{" "}
                {formatCurrency(
                  Math.abs(transaction.amountInBaseCurrency),
                  baseCurrency
                )}
              </Typography>
            </View>
          );
        })}
      </View>
    </View>
  );
}
