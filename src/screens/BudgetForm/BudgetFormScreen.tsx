import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BudgetFormActions,
  BudgetFormHeader,
  CategorySelector,
  PeriodSelector
} from "@/components/budget";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";

import { useBudgetForm } from "./useBudgetForm";

export default function BudgetFormScreen() {
  const {
    amount,
    setAmount,
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
              value={amount}
              onChangeText={setAmount}
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
              <Input
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
              />
              <Typography
                variant="caption"
                color="#6B7280"
                style={{ marginTop: spacing[1] }}
              >
                Format: YYYY-MM-DD (contoh: 2024-01-01)
              </Typography>
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
