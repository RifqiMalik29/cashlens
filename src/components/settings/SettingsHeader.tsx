import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { View } from "react-native";

interface SettingsHeaderProps {
  title: string;
  subtitle: string;
}

export function SettingsHeader({ title, subtitle }: SettingsHeaderProps) {
  const colors = useColors();
  return (
    <View
      className="px-6 pt-6 pb-4"
      style={{ backgroundColor: colors.primary }}
    >
      <Typography variant="h2" weight="bold" color="#FFFFFF">
        {title}
      </Typography>
      <Typography variant="body" color="#FFFFFF">
        {subtitle}
      </Typography>
    </View>
  );
}
