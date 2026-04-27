import { EmptyState } from "@components/transaction/EmptyState";
import { TransactionList } from "@components/transaction/TransactionList";
import { BaseDialog } from "@components/ui/BaseDialog";
import { FAB } from "@components/ui/FAB";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
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
    handleAddTransaction,
    showNoCategoryDialog,
    setShowNoCategoryDialog,
    handleGoToCategories
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
          className="px-6 pt-6 pb-4"
          style={{ backgroundColor: colors.primary }}
        >
          <Typography variant="h2" weight="bold" color="#FFFFFF">
            {t("transactions.title")}
          </Typography>
          <Typography variant="body" color="#FFFFFF">
            {t("transactions.subtitle")}
          </Typography>
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
        <FAB onPress={handleAddTransaction} />
      </View>

      <BaseDialog
        isVisible={showNoCategoryDialog}
        title={t("transactions.noCategoryTitle")}
        message={t("transactions.noCategoryDesc")}
        type="warning"
        primaryButtonText={t("transactions.goToCategories")}
        onPrimaryButtonPress={handleGoToCategories}
        secondaryButtonText={t("common.cancel")}
        onSecondaryButtonPress={() => setShowNoCategoryDialog(false)}
        onClose={() => setShowNoCategoryDialog(false)}
      />
    </SafeAreaView>
  );
}
