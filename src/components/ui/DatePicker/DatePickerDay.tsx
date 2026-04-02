import { TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

import { Typography } from "../Typography";

interface DatePickerDayProps {
  day: number;
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onPress: (date: Date) => void;
}

export function DatePickerDay({
  day,
  date,
  isSelected,
  isToday,
  onPress
}: DatePickerDayProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isSelected
        ? withTiming(colors.primary, { duration: 200 })
        : withTiming("transparent", { duration: 200 }),
      transform: [
        {
          scale: isSelected ? withSpring(1.1) : withSpring(1)
        }
      ]
    };
  });

  const textColor = isSelected
    ? colors.white
    : isToday
      ? colors.primary
      : colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      activeOpacity={0.7}
      style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
    >
      <Animated.View
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center"
          },
          animatedStyle
        ]}
      >
        <Typography
          variant="body"
          weight={isSelected || isToday ? "semibold" : "regular"}
          color={textColor}
        >
          {day}
        </Typography>
      </Animated.View>
    </TouchableOpacity>
  );
}
