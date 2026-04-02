import {
  BookOpen,
  Briefcase,
  Car,
  FileText,
  Gift,
  Heart,
  Home,
  Laptop,
  MoreHorizontal,
  Music,
  PiggyBank,
  Plane,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Wallet
} from "lucide-react-native";
import { type ComponentType } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { spacing } from "@/constants/theme";
import { type Category, type TransactionType } from "@/types";

import { Typography } from "../ui/Typography";

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  type: TransactionType;
  onSelectCategory: (categoryId: string) => void;
}

const ICON_MAP: Record<
  string,
  ComponentType<{ size: number; color: string }>
> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  FileText,
  Heart,
  Music,
  BookOpen,
  Plane,
  Home,
  Sparkles,
  Gift,
  TrendingUp,
  PiggyBank,
  Briefcase,
  MoreHorizontal,
  Wallet,
  Laptop
};

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
                    height: 40,
                    backgroundColor: category.color
                  }}
                >
                  <IconComponent size={18} color="#FFFFFF" />
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
