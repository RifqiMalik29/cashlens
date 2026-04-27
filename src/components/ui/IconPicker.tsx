import { useColors } from "@hooks/useColors";
import * as Icons from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { CATEGORY_ICON_PRESETS } from "../../constants/categoryPresets";

interface IconPickerProps {
  value: string;
  color: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, color, onChange }: IconPickerProps) {
  const colors = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {CATEGORY_ICON_PRESETS.map((iconName) => {
          const Icon = (Icons as Record<string, unknown>)[iconName] as
            | React.ComponentType<{ size: number; color: string }>
            | undefined;
          if (!Icon) return null;
          const isSelected = value === iconName;
          return (
            <TouchableOpacity
              key={iconName}
              onPress={() => onChange(iconName)}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{
                backgroundColor: isSelected ? color : colors.surfaceSecondary,
                borderWidth: isSelected ? 0 : 1,
                borderColor: colors.border
              }}
            >
              <Icon
                size={18}
                color={isSelected ? "#FFFFFF" : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
