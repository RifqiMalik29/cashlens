import { type useColors } from "@hooks/useColors";
import { useRef } from "react";
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  TouchableOpacity,
  View} from "react-native";

import { Typography } from "./Typography";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;
const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

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
  const listRef = useRef<FlatList>(null);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const centeredIndex = Math.round(offsetY / ITEM_HEIGHT);
    const item = data[centeredIndex];
    if (item !== undefined && item !== value) {
      onChange(item);
    }
  };

  const paddedData = [
    ...Array(PADDING_ITEMS).fill(null),
    ...data,
    ...Array(PADDING_ITEMS).fill(null)
  ] as (T | null)[];

  return (
    <View className="flex-1">
      <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
        <FlatList
          ref={listRef}
          data={paddedData}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => item !== null && onChange(item)}
              className="items-center justify-center rounded-lg"
              style={{
                height: ITEM_HEIGHT,
                backgroundColor:
                  item !== null && value === item
                    ? colors.surfaceSecondary
                    : "transparent"
              }}
              disabled={item === null}
            >
              {item !== null && (
                <Typography
                  variant="body"
                  weight={value === item ? "bold" : "regular"}
                  color={value === item ? colors.primary : colors.textSecondary}
                >
                  {renderLabel(item)}
                </Typography>
              )}
            </TouchableOpacity>
          )}
          getItemLayout={(_, i) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * i,
            index: i
          })}
          initialScrollIndex={Math.max(0, index)}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
        />
      </View>
    </View>
  );
}
