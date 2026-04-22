import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { type Category, type TransactionType } from "@types";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  type: TransactionType;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryPicker({
  categories,
  selectedCategoryId,
  type,
  onSelectCategory
}: CategoryPickerProps) {
  const colors = useColors();
  const filteredCategories = categories.filter(
    (cat) => cat.type === "both" || cat.type === type
  );

  return (
    <View>
      <Typography
        variant="label"
        weight="medium"
        color={colors.textSecondary}
        style={{ marginBottom: spacing[3] }}
      >
        Kategori
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {filteredCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                className={`items-center justify-center px-4 py-3 rounded-lg border-2 ${
                  isSelected ? "border-primary" : "border-transparent"
                }`}
                style={{
                  minWidth: 80,
                  backgroundColor: isSelected
                    ? colors.primaryLight
                    : colors.surface
                }}
              >
                <View
                  className="items-center justify-center mb-2"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: category.color,
                    borderRadius: 9999 // Explicitly make it fully rounded
                  }}
                >
                  <Typography variant="h4" weight="bold" color="#FFFFFF">
                    {category.name.charAt(0).toUpperCase()}
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
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
