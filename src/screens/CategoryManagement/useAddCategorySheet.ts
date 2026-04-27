import { categoryService } from "@services/categoryService";
import { useCategoryStore } from "@stores/useCategoryStore";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export function useAddCategorySheet() {
  const { t } = useTranslation();
  const addCategory = useCategoryStore((s) => s.addCategory);

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"expense" | "income">(
    "expense"
  );
  const [newCategoryColor, setNewCategoryColor] = useState("#9CA3AF");
  const [newCategoryIcon, setNewCategoryIcon] = useState("MoreHorizontal");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const handleAddCategory = useCallback(async () => {
    setNewCategoryName("");
    setNewCategoryType("expense");
    setNewCategoryColor("#9CA3AF");
    setNewCategoryIcon("MoreHorizontal");
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
        icon: newCategoryIcon,
        color: newCategoryColor,
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
  }, [
    addCategory,
    newCategoryName,
    newCategoryType,
    newCategoryColor,
    newCategoryIcon,
    t
  ]);

  return {
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
    handleAddCategory,
    handleSubmitNewCategory,
    handleCloseSheet: () => setIsSheetVisible(false)
  };
}
