import { ICON_MAP } from "@constants/iconMap";
import { spacing } from "@constants/theme";
import { type Category, type TransactionType } from "@types";
import { MoreHorizontal } from "lucide-react-native";
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
  const filteredCategories = categories.filter(
    (cat) => cat.type === "both" || cat.type === type
  );

  return (
    <View>
      <Typography
        variant="label"
        weight="medium"
        color="#6B7280"
        style={{ marginBottom: spacing[3] }}
      >
        Kategori
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {filteredCategories.map((category) => {
            const IconComponent = ICON_MAP[category.icon] ?? MoreHorizontal;
            const isSelected = selectedCategoryId === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                className={`items-center justify-center px-4 py-3 rounded-lg border-2 ${
                  isSelected
                    ? "border-primary bg-primary-light"
                    : "border-transparent bg-white"
                }`}
                style={{ minWidth: 80 }}
              >
                <View
                  className="items-center justify-center rounded-full mb-2"
                  style={{
                    width: 40,
                    height: 40
                  }}
                >
                  <IconComponent size={24} color={category.color} />
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
