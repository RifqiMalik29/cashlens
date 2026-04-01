import { Typography } from "@components/ui";
import { View } from "react-native";

import { useTransactionsScreen } from "./useTransactionsScreen";

export default function TransactionsScreen() {
  useTransactionsScreen();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Typography variant="h3" weight="bold">
        Transactions
      </Typography>
    </View>
  );
}
