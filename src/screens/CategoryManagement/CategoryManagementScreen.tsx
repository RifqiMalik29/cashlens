import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { Plus } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { CategoryCard } from "./components/CategoryCard";
import { useCategoryManagementScreen } from "./useCategoryManagementScreen";

export default function CategoryManagementScreen() {
  const {
    filterTypes,
    selectedType,
    expenseCategories,
    incomeCategories,
    handleDeleteCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleFilterSelect,
    error
  } = useCategoryManagementScreen();

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row rounded-lg bg-surface-secondary p-1">
          {filterTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => handleFilterSelect(type.value)}
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

        {error && (
          <Typography
            variant="caption"
            color="#EF4444"
            style={{ marginTop: spacing[2], textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
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
              Kategori Pemasukan ({incomeCategories.length})
            </Typography>
            <View className="flex-row flex-wrap gap-2">
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
    </View>
  );
}
