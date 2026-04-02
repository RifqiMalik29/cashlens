import { heights, spacing } from "@constants/theme";
import { View } from "react-native";

interface PaginationDotsProps {
  activeIndex: number;
  totalSlides: number;
}

export function PaginationDots({
  activeIndex,
  totalSlides
}: PaginationDotsProps) {
  return (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: 6, marginBottom: spacing[6] }}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index === activeIndex ? 24 : 8,
            height: heights.dotIndicator,
            borderRadius: 4,
            backgroundColor: index === activeIndex ? "#4CAF82" : "#E8F5EE"
          }}
        />
      ))}
    </View>
  );
}
