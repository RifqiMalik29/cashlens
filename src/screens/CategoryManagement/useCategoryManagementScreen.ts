import {
  type CategoryResponse,
  categoryService
} from "@services/categoryService";
import { useCategoryStore } from "@stores/useCategoryStore";
import { type Category } from "@types";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollView } from "react-native";

export function useCategoryManagementScreen() {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const syncCategories = useCategoryStore((state) => state.syncCategories);

  const [selectedType, setSelectedType] = useState<
    "all" | "expense" | "income"
  >("all");
  const [error, setError] = useState<string | null>(null);

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"expense" | "income">(
    "expense"
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const transformCategory = useCallback(
    (cat: CategoryResponse): Category => ({
      id: cat?.id || "",
      name: cat?.name || "",
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
    }),
    []
  );

  const syncWithBackend = useCallback(async () => {
    try {
      const categories = await categoryService.getCategories();
      if (categories && Array.isArray(categories)) {
        const transformed = categories.map(transformCategory);
        syncCategories(transformed);
      }
    } catch (err) {
      setError((err as Error).message || "Gagal menyinkronkan kategori");
    }
  }, [syncCategories, transformCategory]);

  // Sync categories when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      syncWithBackend();
    }, [syncWithBackend])
  );

  const filterTypes = useMemo(
    () => [
      { value: "all" as const, label: t("categories.all") },
      { value: "expense" as const, label: t("categories.expense") },
      { value: "income" as const, label: t("categories.income") }
    ],
    [t]
  );

  const filteredCategories = useMemo(() => {
    if (selectedType === "all") return categories;
    return categories.filter(
      (c) => c.type === selectedType || c.type === "both"
    );
  }, [categories, selectedType]);

  const expenseCategories = useMemo(
    () =>
      filteredCategories.filter(
        (c) => c.type === "expense" || c.type === "both"
      ),
    [filteredCategories]
  );

  const incomeCategories = useMemo(
    () =>
      filteredCategories.filter(
        (c) => c.type === "income" || c.type === "both"
      ),
    [filteredCategories]
  );

  const handleDeleteCategory = useCallback(
    async (id: string, isDefault: boolean) => {
      if (isDefault) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("Tidak bisa menghapus kategori default.");
        return;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      try {
        setError(null);
        await categoryService.deleteCategory(id);
        deleteCategory(id);
      } catch (err) {
        setError((err as Error).message || "Gagal menghapus kategori");
      }
    },
    [deleteCategory]
  );

  const handleAddCategory = useCallback(async () => {
    await Haptics.selectionAsync();
    setNewCategoryName("");
    setNewCategoryType("expense");
    setSheetError(null);
    setIsSheetVisible(true);
  }, []);

  const handleSubmitNewCategory = useCallback(async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setSheetError("Nama kategori tidak boleh kosong");
      return;
    }
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
        icon: saved.icon,
        color: saved.color,
        isDefault: saved.is_default,
        isCustom: !saved.is_default,
        type: saved.type
      });
      setIsSheetVisible(false);
    } catch (err) {
      setSheetError((err as Error).message || "Gagal menambah kategori");
    } finally {
      setIsAddingCategory(false);
    }
  }, [addCategory, newCategoryName, newCategoryType]);

  const handleCloseSheet = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const handleUpdateCategory = useCallback(
    async (id: string, newName: string) => {
      await Haptics.selectionAsync();
      try {
        setError(null);
        await categoryService.updateCategory(id, {
          name: newName
        });
        // Optimistic update with the new name
        // The useFocusEffect will sync when you return to ensure consistency
        updateCategory(id, { name: newName });
      } catch (err) {
        setError((err as Error).message || "Gagal memperbarui kategori");
      }
    },
    [updateCategory]
  );

  const handleFilterSelect = useCallback(
    (type: "all" | "expense" | "income") => {
      Haptics.selectionAsync();
      setSelectedType(type);
    },
    []
  );

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
    error,
    isSheetVisible,
    newCategoryName,
    newCategoryType,
    isAddingCategory,
    sheetError,
    setNewCategoryName,
    setNewCategoryType,
    handleSubmitNewCategory,
    handleCloseSheet,
    scrollViewRef
  };
}
