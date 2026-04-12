import { categoryService } from "@services/api/categoryService";
import { useCategoryStore } from "@stores/useCategoryStore";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";

export function useCategoryManagementScreen() {
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  const [selectedType, setSelectedType] = useState<
    "all" | "expense" | "income"
  >("all");

  const filterTypes = useMemo(
    () => [
      { value: "all" as const, label: "Semua" },
      { value: "expense" as const, label: "Pengeluaran" },
      { value: "income" as const, label: "Pemasukan" }
    ],
    []
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
        return;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      try {
        await categoryService.deleteCategory(id);
        deleteCategory(id);
      } catch {
        // silently ignore — pull on next sync will correct state
      }
    },
    [deleteCategory]
  );

  const handleAddCategory = useCallback(async () => {
    await Haptics.selectionAsync();
    try {
      const saved = await categoryService.createCategory({
        name: "Kategori Baru",
        icon: "MoreHorizontal",
        color: "#9CA3AF",
        type: "expense"
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
    } catch {
      // silently ignore
    }
  }, [addCategory]);

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
    handleFilterSelect
  };
}
