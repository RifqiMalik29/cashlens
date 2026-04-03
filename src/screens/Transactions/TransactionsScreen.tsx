import { EmptyState } from "@components/transaction/EmptyState";
import { TransactionList } from "@components/transaction/TransactionList";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    showHeader: false,
    statusBarColor: colors.primary,
    statusBarStyle: "light"
  });

  const hasTransactions = transactions.length > 0;

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ backgroundColor: colors.primary }}
    >
      <View className="flex-1 bg-background">
        <View
          className="px-6 pt-6 pb-4 flex-row items-center justify-between"
          style={{ backgroundColor: colors.primary }}
        >
          <View>
            <Typography variant="h2" weight="bold" color="#FFFFFF">
              Transaksi
            </Typography>
            <Typography variant="body" color="#FFFFFF">
              Riwayat pengeluaran & pemasukan
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
            title="Belum Ada Transaksi"
            description="Mulai catat transaksi keuanganmu untuk melihat riwayat transaksi di sini."
            actionLabel="Tambah Transaksi"
            onAction={handleAddTransaction}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
