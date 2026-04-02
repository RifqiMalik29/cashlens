import { AmountInput } from "@components/transaction/AmountInput";
import { CategoryPicker } from "@components/transaction/CategoryPicker";
import { DateInput } from "@components/transaction/DateInput";
import { TypeSelector } from "@components/transaction/TypeSelector";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { spacing } from "@constants/theme";
import { useHeader } from "@hooks/useHeader";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTransactionForm } from "./useTransactionForm";

export default function TransactionFormScreen() {
  const {
    amount,
    setAmount,
    type,
    handleTypeChange,
    selectedCategoryId,
    setSelectedCategoryId,
    date,
    setDate,
    note,
    setNote,
    isLoading,
    error,
    isEditMode,
    categories,
    baseCurrency,
    handleSave,
    handleDelete
  } = useTransactionForm();

  useHeader({
    title: isEditMode ? "Edit Transaksi" : "Tambah Transaksi"
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacing[8] }}
        >
          <View className="mt-6">
            <AmountInput
              amount={amount}
              setAmount={setAmount}
              type={type}
              baseCurrency={baseCurrency}
            />

            <TypeSelector type={type} onTypeChange={handleTypeChange} />

            <View style={{ marginBottom: spacing[5] }}>
              <CategoryPicker
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                type={type}
                onSelectCategory={setSelectedCategoryId}
              />
            </View>

            <View style={{ marginBottom: spacing[5] }}>
              <DateInput date={date} setDate={setDate} />
            </View>

            <View style={{ marginBottom: spacing[5] }}>
              <Input
                label="Catatan (opsional)"
                placeholder="Tambah catatan..."
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
              />
            </View>

            {error && (
              <View style={{ marginBottom: spacing[4] }}>
                <Button onPress={() => {}} variant="danger" disabled>
                  {error}
                </Button>
              </View>
            )}

            <View style={{ gap: spacing[3] }} className="mt-2">
              <Button
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                variant="primary"
                size="lg"
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah Transaksi"}
              </Button>

              {isEditMode && (
                <Button
                  onPress={handleDelete}
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                  variant="danger"
                  size="lg"
                >
                  Hapus Transaksi
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
