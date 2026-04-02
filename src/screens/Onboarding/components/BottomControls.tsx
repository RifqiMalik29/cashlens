import { Typography } from "@components/ui/Typography";
import { heights, spacing } from "@constants/theme";
import { TouchableOpacity, View } from "react-native";

interface BottomControlsProps {
  activeIndex: number;
  onNext: () => void;
}

export function BottomControls({ activeIndex, onNext }: BottomControlsProps) {
  return (
    <View style={{ alignItems: "center", paddingBottom: spacing[8] }}>
      <TouchableOpacity
        onPress={onNext}
        className="items-center justify-center px-6 rounded-md bg-primary"
        style={{ height: heights.buttonLg }}
      >
        <Typography
          variant="body"
          weight="semibold"
          color="#FFFFFF"
          style={{ fontSize: 16 }}
        >
          {activeIndex === 2 ? "Mulai Sekarang" : "Selanjutnya"}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
