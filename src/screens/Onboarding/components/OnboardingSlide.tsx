import { ScanLine, Target, Wallet } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

import { spacing } from "@/constants/theme";

type IconComponent = typeof Wallet | typeof ScanLine | typeof Target;

interface OnboardingSlideProps {
  title: string;
  subtitle: string;
  iconName: string;
  iconSize: number;
  screenWidth: number;
}

const ICON_MAP: Record<string, IconComponent> = {
  Wallet,
  ScanLine,
  Target
};

export function OnboardingSlide({
  title,
  subtitle,
  iconName,
  iconSize,
  screenWidth
}: OnboardingSlideProps) {
  const IconComponent = ICON_MAP[iconName];

  return (
    <View className="flex-1" style={{ width: screenWidth }}>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32
        }}
      >
        <IconComponent size={iconSize} color="#4CAF82" />
        <Text
          className="text-2xl font-bold text-center"
          style={{
            color: "#1A1A2E",
            marginTop: spacing[6]
          }}
        >
          {title}
        </Text>
        <Text
          className="text-base text-center"
          style={{
            color: "#6B7280",
            marginTop: spacing[3]
          }}
        >
          {subtitle}
        </Text>
      </ScrollView>
    </View>
  );
}
