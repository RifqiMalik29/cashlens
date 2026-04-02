import { View } from "react-native";

import { spacing } from "@/constants/theme";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ paddingBottom: spacing[10] }}
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
        color="#6B7280"
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
