import { Typography } from "@components/ui";
import { View } from "react-native";

import { useDashboardScreen } from "./useDashboardScreen";

export default function DashboardScreen() {
  useDashboardScreen();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Typography variant="h3" weight="bold">
        Dashboard
      </Typography>
    </View>
  );
}
