import { ScrollView, TouchableOpacity, View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";
import { type Category } from "@/types";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategory
}: CategorySelectorProps) {
  return (
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
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
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
                <Typography variant="caption" weight="bold" color="#FFFFFF">
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
  );
}
