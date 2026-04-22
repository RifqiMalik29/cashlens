import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import type { ReactNode } from "react";
import { View } from "react-native";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colors = useColors();
  return (
    <View className="px-6 mt-6">
      <Typography
        variant="label"
        weight="medium"
        color={colors.textSecondary}
        style={{ marginBottom: spacing[2] }}
      >
        {title}
      </Typography>
      {children}
    </View>
  );
}
