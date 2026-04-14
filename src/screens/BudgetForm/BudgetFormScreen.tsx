import { DateInput } from "@components/transaction/DateInput";
import {
  BudgetFormActions,
  BudgetFormHeader,
  CategorySelector,
  PeriodSelector
} from "@components/budget";
import { Input } from "@components/ui/Input";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useBudgetForm } from "./useBudgetForm";

export default function BudgetFormScreen() {
  const {
    displayAmount,
    handleAmountChange,
    selectedCategoryId,
    setSelectedCategoryId,
    period,
    handlePeriodChange,
    startDate,
    setStartDate,
    isLoading,
    error,
    isEditMode,
    expenseCategories,
    handleSave,
    handleDelete
  } = useBudgetForm();

  return (
    <SafeAreaView edges={[]} className="flex-1 bg-background">
      <BudgetFormHeader isEditMode={isEditMode} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacing[8] }}
        >
          <View className="mt-6">
            <Typography
              variant="label"
              weight="medium"
              color="#6B7280"
              style={{ marginBottom: spacing[2] }}
            >
              Jumlah Anggaran
            </Typography>
            <Input
              placeholder="0"
              value={displayAmount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />

            <CategorySelector
              categories={expenseCategories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            <PeriodSelector
              selectedPeriod={period}
              onSelectPeriod={handlePeriodChange}
            />

            <View style={{ marginTop: spacing[5] }}>
              <Typography
                variant="label"
                weight="medium"
                color="#6B7280"
                style={{ marginBottom: spacing[2] }}
              >
                Tanggal Mulai
              </Typography>
              <DateInput date={startDate} setDate={setStartDate} />
            </View>

            <BudgetFormActions
              isEditMode={isEditMode}
              isLoading={isLoading}
              error={error}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
