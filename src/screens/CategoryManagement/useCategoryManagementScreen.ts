import {
  type CategoryResponse,
  categoryService
} from "@services/categoryService";
import { useCategoryStore } from "@stores/useCategoryStore";
import { useTransactionStore } from "@stores/useTransactionStore";
import { type Category } from "@types";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollView } from "react-native";

type FilterType = "all" | "expense" | "income";

export function useCategoryManagementScreen() {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const syncCategories = useCategoryStore((state) => state.syncCategories);
  const transactions = useTransactionStore((state) => state.transactions);

  const [selectedType, setSelectedType] = useState<FilterType>("all");
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"expense" | "income">(
    "expense"
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const filterTypes = [
    { value: "all" as const, label: t("categories.all") },
    { value: "expense" as const, label: t("categories.expense") },
    { value: "income" as const, label: t("categories.income") }
  ];
  const transformCategory = useCallback(
    (cat: CategoryResponse): Category => {
      const nameKey = cat?.name_key ?? null;
      const name = nameKey
        ? t(`categories.names.${nameKey}`, { defaultValue: cat?.name || "" })
        : cat?.name || "";
      return {
        id: cat?.id || "",
        name,
        nameKey,
        icon: cat?.icon || "MoreHorizontal",
        color: cat?.color || "#9CA3AF",
        isDefault: cat?.is_default || false,
        isCustom: !cat?.is_default,
        type:
          cat?.type === "income"
            ? "income"
            : cat?.type === "expense"
              ? "expense"
              : "both"
      };
    },
    [t]
  );
  const syncWithBackend = useCallback(async () => {
    try {
      const categories = await categoryService.getCategories();
      if (categories && Array.isArray(categories)) {
        const transformed = categories.map(transformCategory);
        syncCategories(transformed);
      }
    } catch (err) {
      setErrorDialog((err as Error).message || t("form.genericError"));
    }
  }, [syncCategories, transformCategory, t]);
  useFocusEffect(
    useCallback(() => {
      syncWithBackend();
    }, [syncWithBackend])
  );
  const filteredCategories = useMemo(() => {
    if (selectedType === "all") return categories;
    return categories.filter(
      (c) => c.type === selectedType || c.type === "both"
    );
  }, [categories, selectedType]);
  const { expenseCategories, incomeCategories } = useMemo(
    () => ({
      expenseCategories: filteredCategories.filter(
        (c) => c.type === "expense" || c.type === "both"
      ),
      incomeCategories: filteredCategories.filter(
        (c) => c.type === "income" || c.type === "both"
      )
    }),
    [filteredCategories]
  );
  const handleDeleteCategory = useCallback(
    async (id: string, isDefault: boolean) => {
      if (isDefault) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return setErrorDialog(t("categories.cannotDeleteDefault"));
      }
      const usageCount = transactions.filter(
        (tx) => tx.categoryId === id
      ).length;
      if (usageCount > 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return setErrorDialog(
          t("categories.cannotDeleteWithTransactions", { count: usageCount })
        );
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      try {
        setErrorDialog(null);
        await categoryService.deleteCategory(id);
        deleteCategory(id);
      } catch (err) {
        setErrorDialog((err as Error).message || t("categories.deleteFailed"));
      }
    },
    [deleteCategory, transactions, t]
  );
  const handleAddCategory = useCallback(async () => {
    setNewCategoryName("");
    setNewCategoryType("expense");
    setSheetError(null);
    setIsSheetVisible(true);
    await Haptics.selectionAsync();
  }, []);
  const handleSubmitNewCategory = useCallback(async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return setSheetError(t("categories.nameRequired"));
    await Haptics.selectionAsync();
    setIsAddingCategory(true);
    setSheetError(null);
    try {
      const saved = await categoryService.createCategory({
        name: trimmed,
        icon: "MoreHorizontal",
        color: "#9CA3AF",
        type: newCategoryType
      });
      addCategory({
        id: saved.id,
        name: saved.name,
        nameKey: saved.name_key ?? null,
        icon: saved.icon,
        color: saved.color,
        isDefault: saved.is_default,
        isCustom: !saved.is_default,
        type: saved.type
      });
      setIsSheetVisible(false);
    } catch (err) {
      setSheetError((err as Error).message || t("categories.addFailed"));
    } finally {
      setIsAddingCategory(false);
    }
  }, [addCategory, newCategoryName, newCategoryType, t]);
  const handleUpdateCategory = useCallback(
    async (id: string, newName: string, newColor: string, newIcon: string) => {
      await Haptics.selectionAsync();
      try {
        setErrorDialog(null);
        const payload = { name: newName, color: newColor, icon: newIcon };
        await categoryService.updateCategory(id, payload);
        updateCategory(id, payload);
      } catch (err) {
        setErrorDialog((err as Error).message || t("categories.updateFailed"));
      }
    },
    [updateCategory, t]
  );
  const handleFilterSelect = useCallback((type: FilterType) => {
    Haptics.selectionAsync();
    setSelectedType(type);
  }, []);
  return {
    filterTypes,
    selectedType,
    filteredCategories,
    expenseCategories,
    incomeCategories,
    handleDeleteCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleFilterSelect,
    syncWithBackend,
    errorDialog,
    setErrorDialog,
    isSheetVisible,
    newCategoryName,
    newCategoryType,
    isAddingCategory,
    sheetError,
    setNewCategoryName,
    setNewCategoryType,
    handleSubmitNewCategory,
    handleCloseSheet: () => setIsSheetVisible(false),
    scrollViewRef
  };
}
