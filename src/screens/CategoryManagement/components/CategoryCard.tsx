import { Typography } from "@components/ui/Typography";
import type { Category } from "@types";
import { Trash2 } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string, isDefault: boolean) => void;
}

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
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
