import { Typography } from "@components/ui/Typography";
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
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3"
      activeOpacity={0.7}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Typography
          variant="body"
          weight="medium"
          color={danger ? "#EF4444" : "#1A1A2E"}
        >
          {label}
        </Typography>
      </View>
      {value && (
        <Typography variant="body" color="#6B7280" style={{ marginRight: 8 }}>
          {value}
        </Typography>
      )}
      {accessory ?? (
        <ChevronRight size={20} color={danger ? "#EF4444" : "#9CA3AF"} />
      )}
    </TouchableOpacity>
  );
}
