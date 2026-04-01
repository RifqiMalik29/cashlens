import { Typography } from "@components/ui";
import { View } from "react-native";

import { useBudgetScreen } from "./useBudgetScreen";

export default function BudgetScreen() {
  useBudgetScreen();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Typography variant="h3" weight="bold">
        Budget
      </Typography>
    </View>
  );
}
