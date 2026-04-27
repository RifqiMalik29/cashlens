import { BaseDialog } from "@components/ui/BaseDialog";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { useHeader } from "@hooks/useHeader";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

import { AddCategorySheet } from "./components/AddCategorySheet";
import { CategoryCard } from "./components/CategoryCard";
import { useCategoryManagementScreen } from "./useCategoryManagementScreen";

export default function CategoryManagementScreen() {
  const { t } = useTranslation();
  const {
    filterTypes,
    selectedType,
    expenseCategories,
    incomeCategories,
    handleDeleteCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleFilterSelect,
    errorDialog,
    setErrorDialog,
    isSheetVisible,
    newCategoryName,
    newCategoryType,
    newCategoryColor,
    newCategoryIcon,
    isAddingCategory,
    sheetError,
    setNewCategoryName,
    setNewCategoryType,
    setNewCategoryColor,
    setNewCategoryIcon,
    handleSubmitNewCategory,
    handleCloseSheet,
    scrollViewRef
  } = useCategoryManagementScreen();

  const colors = useColors();
  useHeader({ statusBarStyle: "dark", title: t("categories.title") });

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-6 pt-4 pb-4">
        <View
          className="flex-row rounded-lg p-1"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          {filterTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => handleFilterSelect(type.value)}
              className={`flex-1 items-center justify-center py-2 rounded-md`}
              style={
                selectedType === type.value
                  ? { backgroundColor: colors.surface }
                  : undefined
              }
            >
              <Typography
                variant="caption"
                weight={selectedType === type.value ? "semibold" : "regular"}
                color={
                  selectedType === type.value ? "#4CAF82" : colors.textSecondary
                }
              >
                {type.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {expenseCategories.length > 0 && (
            <View className="mb-6">
              <Typography
                variant="body"
                weight="semibold"
                color="#EF4444"
                style={{ marginBottom: spacing[2] }}
              >
                {t("categories.expenseCategories")} ({expenseCategories.length})
              </Typography>
              <View>
                {expenseCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onDelete={handleDeleteCategory}
                    onUpdate={handleUpdateCategory}
                  />
                ))}
              </View>
            </View>
          )}

          {incomeCategories.length > 0 && (
            <View className="mb-6">
              <Typography
                variant="body"
                weight="semibold"
                color="#10B981"
                style={{ marginBottom: spacing[2] }}
              >
                {t("categories.incomeCategories")} ({incomeCategories.length})
              </Typography>
              <View>
                {incomeCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onDelete={handleDeleteCategory}
                    onUpdate={handleUpdateCategory}
                  />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={handleAddCategory}
            className="flex-row items-center justify-center border-2 border-dashed border-border rounded-lg py-4 mb-8"
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.textSecondary} />
            <Typography
              variant="body"
              weight="medium"
              color={colors.textSecondary}
              style={{ marginLeft: 8 }}
            >
              {t("categories.addCustom")}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <AddCategorySheet
        isVisible={isSheetVisible}
        name={newCategoryName}
        type={newCategoryType}
        color={newCategoryColor}
        icon={newCategoryIcon}
        isLoading={isAddingCategory}
        error={sheetError}
        onNameChange={setNewCategoryName}
        onTypeChange={setNewCategoryType}
        onColorChange={setNewCategoryColor}
        onIconChange={setNewCategoryIcon}
        onSubmit={handleSubmitNewCategory}
        onClose={handleCloseSheet}
      />

      <BaseDialog
        isVisible={!!errorDialog}
        title={t("common.error")}
        message={errorDialog ?? ""}
        type="error"
        primaryButtonText={t("common.confirm")}
        onPrimaryButtonPress={() => setErrorDialog(null)}
        onClose={() => setErrorDialog(null)}
      />
    </View>
  );
}
