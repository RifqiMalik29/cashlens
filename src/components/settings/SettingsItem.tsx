import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

interface SettingsItemProps {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  onPress?: () => void;
  danger?: boolean;
  disabled?: boolean;
  accessory?: ReactNode;
}

export function SettingsItem({
  icon,
  label,
  value,
  onPress,
  danger,
  disabled,
  accessory
}: SettingsItemProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      className="flex-row items-center border border-border rounded-lg px-4 py-3"
      activeOpacity={!disabled && onPress ? 0.7 : 1}
      style={{ opacity: disabled ? 0.5 : 1, backgroundColor: colors.surface }}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Typography
          variant="body"
          weight="medium"
          color={danger ? colors.error : colors.textPrimary}
        >
          {label}
        </Typography>
      </View>
      {value && (
        <Typography
          variant="body"
          color={colors.textSecondary}
          style={{ marginRight: 8 }}
        >
          {value}
        </Typography>
      )}
      {accessory ??
        (onPress && (
          <ChevronRight
            size={20}
            color={danger ? colors.error : colors.textSecondary}
          />
        ))}
    </TouchableOpacity>
  );
}
