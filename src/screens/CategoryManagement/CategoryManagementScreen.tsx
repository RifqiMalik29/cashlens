import * as Haptics from "expo-haptics";
import { Plus, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { type Category } from "@/types";

export default function CategoryManagementScreen() {
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  const [selectedType, setSelectedType] = useState<
    "all" | "expense" | "income"
  >("all");

  const filteredCategories = useMemo(() => {
    if (selectedType === "all") return categories;
    return categories.filter(
      (c) => c.type === selectedType || c.type === "both"
    );
  }, [categories, selectedType]);

  const expenseCategories = filteredCategories.filter(
    (c) => c.type === "expense" || c.type === "both"
  );
  const incomeCategories = filteredCategories.filter(
    (c) => c.type === "income" || c.type === "both"
  );

  const handleDeleteCategory = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteCategory(id);
  };

  const handleAddCategory = async () => {
    await Haptics.selectionAsync();
    const newCategory = {
      id: `custom_${Date.now()}`,
      name: "Kategori Baru",
      icon: "MoreHorizontal",
      color: "#9CA3AF",
      isDefault: false,
      isCustom: true,
      type: "expense" as const
    };
    addCategory(newCategory);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row rounded-lg bg-surface-secondary p-1">
          {[
            { value: "all", label: "Semua" },
            { value: "expense", label: "Pengeluaran" },
            { value: "income", label: "Pemasukan" }
          ].map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedType(type.value as typeof selectedType);
              }}
              className={`flex-1 items-center justify-center py-2 rounded-md ${
                selectedType === type.value ? "bg-white" : ""
              }`}
            >
              <Typography
                variant="caption"
                weight={selectedType === type.value ? "semibold" : "regular"}
                color={selectedType === type.value ? "#4CAF82" : "#6B7280"}
              >
                {type.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {expenseCategories.length > 0 && (
          <View className="mb-6">
            <Typography
              variant="body"
              weight="semibold"
              color="#EF4444"
              style={{ marginBottom: spacing[2] }}
            >
              Kategori Pengeluaran ({expenseCategories.length})
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {expenseCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onDelete={handleDeleteCategory}
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
              Kategori Pemasukan ({incomeCategories.length})
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {incomeCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onDelete={handleDeleteCategory}
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
          <Plus size={20} color="#9CA3AF" />
          <Typography
            variant="body"
            weight="medium"
            color="#9CA3AF"
            style={{ marginLeft: 8 }}
          >
            Tambah Kategori Custom
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string, isDefault: boolean) => void;
}

function CategoryCard({ category, onDelete }: CategoryCardProps) {
  return (
    <View className="flex-row items-center bg-white border border-border rounded-lg pl-3 pr-2 py-2">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mr-2"
        style={{ backgroundColor: category.color }}
      >
        <Typography variant="caption" weight="bold" color="#FFFFFF">
          {category.name.charAt(0)}
        </Typography>
      </View>
      <Typography
        variant="caption"
        weight="medium"
        numberOfLines={1}
        style={{ maxWidth: 100 }}
      >
        {category.name}
      </Typography>
      {!category.isDefault && (
        <TouchableOpacity
          onPress={() => onDelete(category.id, category.isDefault)}
          className="ml-2 p-1"
        >
          <Trash2 size={14} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}
