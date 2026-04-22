import { spacing } from "@constants/theme";
import { useColors } from "@hooks/useColors";
import { View, type ViewStyle } from "react-native";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  customContainerStyle?: ViewStyle;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  customContainerStyle
}: EmptyStateProps) {
  const colors = useColors();
  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={[
        { paddingBottom: spacing[10], backgroundColor: colors.background },
        customContainerStyle
      ]}
    >
      <Typography
        variant="h3"
        weight="bold"
        style={{ textAlign: "center", marginBottom: spacing[2] }}
      >
        {title}
      </Typography>
      <Typography
        variant="body"
        color={colors.textSecondary}
        style={{ textAlign: "center", marginBottom: spacing[6] }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
