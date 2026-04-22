import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { Wallet } from "lucide-react-native";
import { View } from "react-native";

import { Typography } from "../ui/Typography";

export function AuthLogo() {
  const colors = useColors();
  return (
    <View className="items-center justify-center pt-10 pb-8">
      <Wallet size={48} color="#4CAF82" />
      <Typography
        variant="h1"
        weight="bold"
        style={{ marginTop: spacing[3], color: colors.textPrimary }}
      >
        CashLens
      </Typography>
      <Typography
        variant="body"
        color={colors.textSecondary}
        style={{ marginTop: spacing[1] }}
      >
        Kelola keuanganmu dengan cerdas
      </Typography>
    </View>
  );
}
