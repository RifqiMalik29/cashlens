import { Button, Card, Typography } from "@components/ui";
import { useColors } from "@hooks/useColors";
import React from "react";
import { View } from "react-native";

interface QuotaBannerProps {
  count: number;
  limit: number;
  onPressUpgrade: () => void;
}

export function QuotaBanner({
  count,
  limit,
  onPressUpgrade
}: QuotaBannerProps) {
  const colors = useColors();
  const percentage = Math.min(100, Math.round((count / limit) * 100));
  const isNearLimit = percentage >= 80;

  return (
    <View className="px-6 mb-4">
      <Card className={isNearLimit ? "border-warning bg-warning/10" : ""}>
        <View className="flex-row justify-between items-center mb-2">
          <Typography
            variant="body"
            weight="medium"
            color={isNearLimit ? "#F59E0B" : colors.textSecondary}
          >
            {count} / {limit} transaksi bulan ini
          </Typography>
          <Typography
            variant="caption"
            color={isNearLimit ? "#F59E0B" : colors.textSecondary}
          >
            {percentage}%
          </Typography>
        </View>
        <View
          className="h-2 rounded-full overflow-hidden w-full mb-3"
          style={{ backgroundColor: colors.border }}
        >
          <View
            className={`h-full rounded-full ${isNearLimit ? "bg-warning" : "bg-primary"}`}
            style={{ width: `${percentage}%` }}
          />
        </View>
        {isNearLimit && (
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onPress={onPressUpgrade}
          >
            Upgrade ke Premium
          </Button>
        )}
      </Card>
    </View>
  );
}
