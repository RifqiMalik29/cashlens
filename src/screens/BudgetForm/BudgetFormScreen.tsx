import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
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

  const periods: { value: string; label: string }[] = [
    { value: "weekly", label: "Mingguan" },
    { value: "monthly", label: "Bulanan" },
    { value: "yearly", label: "Tahunan" }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
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

            <View style={{ marginTop: spacing[5] }}>
              <Typography
                variant="label"
                weight="medium"
                color="#6B7280"
                style={{ marginBottom: spacing[2] }}
              >
                Kategori
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {expenseCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                      className={`items-center justify-center px-4 py-3 rounded-lg border-2 ${
                        selectedCategoryId === category.id
                          ? "border-primary bg-primary-light"
                          : "border-transparent bg-white"
                      }`}
                      style={{ minWidth: 80 }}
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <Typography
                          variant="caption"
                          weight="bold"
                          color="#FFFFFF"
                        >
                          {category.name.charAt(0)}
                        </Typography>
                      </View>
                      <Typography
                        variant="caption"
                        weight="medium"
                        numberOfLines={2}
                        style={{ textAlign: "center" }}
                      >
                        {category.name}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={{ marginTop: spacing[5] }}>
              <Typography
                variant="label"
                weight="medium"
                color="#6B7280"
                style={{ marginBottom: spacing[2] }}
              >
                Periode
              </Typography>
              <View className="flex-row rounded-lg bg-surface-secondary p-1">
                {periods.map((p) => (
                  <TouchableOpacity
                    key={p.value}
                    onPress={() =>
                      handlePeriodChange(
                        p.value as "weekly" | "monthly" | "yearly"
                      )
                    }
                    className={`flex-1 items-center justify-center py-3 rounded-md ${
                      period === p.value ? "bg-white" : ""
                    }`}
                  >
                    <Typography
                      variant="caption"
                      weight={period === p.value ? "semibold" : "regular"}
                      color={period === p.value ? "#4CAF82" : "#6B7280"}
                    >
                      {p.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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

            {error && (
              <View style={{ marginTop: spacing[4], marginBottom: spacing[4] }}>
                <Button onPress={() => {}} variant="danger" disabled>
                  {error}
                </Button>
              </View>
            )}

            <View style={{ gap: spacing[3], marginTop: spacing[6] }}>
              <Button
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                variant="primary"
                size="lg"
              >
                {isEditMode ? "Simpan Perubahan" : "Buat Anggaran"}
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
                  Hapus Anggaran
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
