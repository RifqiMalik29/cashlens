import { useColors } from "@hooks/useColors";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export function ProgressBar({ progress, color }: ProgressBarProps) {
  const colors = useColors();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getProgressColor = () => {
    if (color) return color;
    if (clampedProgress < 70) return "#10B981";
    if (clampedProgress < 90) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <View
      className="h-2 rounded-full overflow-hidden"
      style={{ backgroundColor: colors.border }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: getProgressColor()
        }}
      />
    </View>
  );
}
