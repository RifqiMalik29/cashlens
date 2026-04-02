import { EmptyState } from "@components/transaction/EmptyState";
import { TransactionList } from "@components/transaction/TransactionList";
import { useHeader } from "@hooks/useHeader";
import { Plus } from "lucide-react-native";
import { View } from "react-native";

import { useTransactionsScreen } from "./useTransactionsScreen";

export default function TransactionsScreen() {
  const {
    transactions,
    categories,
    baseCurrency,
    handleTransactionPress,
    handleAddTransaction
  } = useTransactionsScreen();
  useHeader({
    title: "Transaksi",
    rightElement: (
      <Plus
        size={24}
        color="#4CAF82"
        onPress={handleAddTransaction}
        className="p-2"
      />
    )
  });

  const hasTransactions = transactions.length > 0;

  return (
    <View className="flex-1 bg-background">
      {hasTransactions ? (
        <TransactionList
          transactions={transactions}
          categories={categories}
          baseCurrency={baseCurrency}
          onTransactionPress={handleTransactionPress}
        />
      ) : (
        <EmptyState
          title="Belum Ada Transaksi"
          description="Mulai catat transaksi keuanganmu untuk melihat riwayat transaksi di sini."
          actionLabel="Tambah Transaksi"
          onAction={handleAddTransaction}
        />
      )}
    </View>
  );
}
