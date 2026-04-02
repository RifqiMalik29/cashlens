import { Wallet } from "lucide-react-native";
import { View } from "react-native";

import { spacing } from "@/constants/theme";

import { Typography } from "../ui/Typography";

export function AuthLogo() {
  return (
    <View className="items-center justify-center pt-10 pb-8">
      <Wallet size={48} color="#4CAF82" />
      <Typography
        variant="h1"
        weight="bold"
        style={{ marginTop: spacing[3], color: "#1A1A2E" }}
      >
        CashLens
      </Typography>
      <Typography
        variant="body"
        color="#6B7280"
        style={{ marginTop: spacing[1] }}
      >
        Kelola keuanganmu dengan cerdas
      </Typography>
    </View>
  );
}
