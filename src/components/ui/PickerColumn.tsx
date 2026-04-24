import { type useColors } from "@hooks/useColors";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Typography } from "./Typography";

const ITEM_HEIGHT = 44;

interface PickerColumnProps<T extends string | number> {
  data: T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel: (v: T) => string;
  colors: ReturnType<typeof useColors>;
}

export function PickerColumn<T extends string | number>({
  data,
  value,
  onChange,
  renderLabel,
  colors
}: PickerColumnProps<T>) {
  const index = data.indexOf(value);
  return (
    <View className="flex-1">
      <View className="h-40">
        <FlatList
          data={data}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onChange(item)}
              className="items-center py-3 rounded-lg"
              style={{
                backgroundColor:
                  value === item ? colors.surfaceSecondary : "transparent"
              }}
            >
              <Typography
                variant="body"
                weight={value === item ? "bold" : "regular"}
                color={value === item ? colors.primary : colors.textSecondary}
              >
                {renderLabel(item)}
              </Typography>
            </TouchableOpacity>
          )}
          getItemLayout={(_, i) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * i,
            index: i
          })}
          initialScrollIndex={Math.max(0, index)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
