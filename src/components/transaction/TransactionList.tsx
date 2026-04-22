import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { type Category, type Transaction } from "@types";
import { formatCompactCurrency } from "@utils/formatCurrency";
import { SectionList, Text, View } from "react-native";

import { TransactionItem } from "./TransactionItem";

interface TransactionSection {
  title: string;
  date: string;
  data: Transaction[];
  netBalance: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  baseCurrency: string;
  onTransactionPress?: (transaction: Transaction) => void;
}

function getSectionTitle(date: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Hari Ini";
  if (isYesterday) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionSection[] {
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach((transaction) => {
    const dateKey = transaction.date.split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });

  const sections: TransactionSection[] = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .map((dateKey) => {
      const dateTransactions = grouped[dateKey];
      const netBalance = dateTransactions.reduce((sum, t) => {
        return t.type === "income"
          ? sum + t.amountInBaseCurrency
          : sum - t.amountInBaseCurrency;
      }, 0);

      const date = new Date(dateKey);

      return {
        title: getSectionTitle(date),
        date: dateKey,
        data: dateTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        netBalance
      };
    });

  return sections;
}

export function TransactionList({
  transactions,
  categories,
  baseCurrency,
  onTransactionPress
}: TransactionListProps) {
  const colors = useColors();
  const sections = groupTransactionsByDate(transactions);

  const renderSectionHeader = ({
    section
  }: {
    section: TransactionSection;
  }) => {
    const balanceColor = section.netBalance >= 0 ? "#10B981" : "#EF4444";
    const balancePrefix = section.netBalance >= 0 ? "+" : "-";

    return (
      <View
        className="px-4 py-2"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold" style={{ color: "#6B7280" }}>
            {section.title}
          </Text>
          <Text className="text-xs font-medium" style={{ color: balanceColor }}>
            {balancePrefix}{" "}
            {formatCompactCurrency(Math.abs(section.netBalance), baseCurrency)}
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const category = categories.find((c) => c.id === item.categoryId);

    return (
      <TransactionItem
        transaction={item}
        category={category}
        baseCurrency={baseCurrency}
        onPress={() => onTransactionPress?.(item)}
      />
    );
  };

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: spacing[8] }}
    />
  );
}
