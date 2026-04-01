import { Typography } from "@components/ui";
import { View } from "react-native";

import { useScannerScreen } from "./useScannerScreen";

export default function ScannerScreen() {
  useScannerScreen();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Typography variant="h3" weight="bold">
        Scanner
      </Typography>
    </View>
  );
}
