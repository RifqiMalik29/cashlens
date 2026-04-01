import { Typography } from "@components/ui";
import { View } from "react-native";

import { useSettingsScreen } from "./useSettingsScreen";

export default function SettingsScreen() {
  useSettingsScreen();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Typography variant="h3" weight="bold">
        Settings
      </Typography>
    </View>
  );
}
