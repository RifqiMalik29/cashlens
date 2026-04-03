import type { ReactNode } from "react";
import { View } from "react-native";

import { Typography } from "@/components/ui/Typography";
import { spacing } from "@/constants/theme";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="px-6 mt-6">
      <Typography
        variant="label"
        weight="medium"
        color="#6B7280"
        style={{ marginBottom: spacing[2] }}
      >
        {title}
      </Typography>
      {children}
    </View>
  );
}
