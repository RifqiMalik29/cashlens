import { AmountInput } from "@components/transaction/AmountInput";
import { CategoryPicker } from "@components/transaction/CategoryPicker";
import { DateInput } from "@components/transaction/DateInput";
import { TypeSelector } from "@components/transaction/TypeSelector";
import { BaseDialog } from "@components/ui/BaseDialog";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { useTransactionForm } from "./useTransactionForm";

export default function TransactionFormScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const router = useProtectedRouter();
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
    handleDelete,
    showPaywall,
    setShowPaywall,
    showUncategorizedDialog,
    setShowUncategorizedDialog,
    handleConfirmUncategorized
  } = useTransactionForm();

  useHeader({
    title: isEditMode
      ? t("transactions.editTransaction")
      : t("transactions.addTransaction")
  });

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: colors.background }}
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
                label={t("transactions.noteOptional")}
                placeholder={t("form.notePlaceholder")}
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
                {isEditMode
                  ? t("transactions.saveChanges")
                  : t("transactions.addTransaction")}
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
                  {t("transactions.deleteTransaction")}
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BaseDialog
        isVisible={showUncategorizedDialog}
        title={t("form.uncategorizedTitle")}
        message={t("form.uncategorizedDesc")}
        type="warning"
        primaryButtonText={t("form.addUncategorized")}
        onPrimaryButtonPress={() => {
          setShowUncategorizedDialog(false);
          handleConfirmUncategorized();
        }}
        secondaryButtonText={t("common.cancel")}
        onSecondaryButtonPress={() => setShowUncategorizedDialog(false)}
        onClose={() => setShowUncategorizedDialog(false)}
      />
      <BaseDialog
        isVisible={showPaywall}
        title={t("transactions.transactionLimitTitle")}
        message={t("transactions.transactionLimitDesc")}
        type="warning"
        primaryButtonText={t("transactions.upgradeNow")}
        onPrimaryButtonPress={() => {
          setShowPaywall(false);
          router.push("/upgrade" as never);
        }}
        secondaryButtonText={t("transactions.later")}
        onSecondaryButtonPress={() => setShowPaywall(false)}
        onClose={() => setShowPaywall(false)}
      />
    </View>
  );
}
