import { useColors } from "@hooks/useColors";
import { Check } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { CATEGORY_COLOR_PRESETS } from "../../constants/categoryPresets";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const colors = useColors();
  return (
    <View className="flex-row flex-wrap gap-2">
      {CATEGORY_COLOR_PRESETS.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onChange(color)}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: color,
            borderWidth: value === color ? 2 : 0,
            borderColor: colors.textPrimary
          }}
        >
          {value === color && <Check size={14} color="#FFFFFF" />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
