import { EmptyState } from "@components/transaction/EmptyState";
import { TransactionList } from "@components/transaction/TransactionList";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTransactionsScreen } from "./useTransactionsScreen";

export default function TransactionsScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const {
    transactions,
    categories,
    baseCurrency,
    hasTransactions,
    handleTransactionPress,
    handleAddTransaction
  } = useTransactionsScreen();

  useHeader({
    showHeader: false,
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.primary }}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View
          className="px-6 pt-6 pb-4 flex-row items-center justify-between"
          style={{ backgroundColor: colors.primary }}
        >
          <View>
            <Typography variant="h2" weight="bold" color="#FFFFFF">
              {t("transactions.title")}
            </Typography>
            <Typography variant="body" color="#FFFFFF">
              {t("transactions.subtitle")}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={handleAddTransaction}
            className="bg-white/20 p-2 rounded-full"
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {hasTransactions ? (
          <TransactionList
            transactions={transactions}
            categories={categories}
            baseCurrency={baseCurrency}
            onTransactionPress={handleTransactionPress}
          />
        ) : (
          <EmptyState
            title={t("transactions.noTransactions")}
            description={t("transactions.noTransactionsDesc")}
            actionLabel={t("transactions.addTransaction")}
            onAction={handleAddTransaction}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
