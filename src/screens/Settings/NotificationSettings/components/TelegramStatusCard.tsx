import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { Send } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

interface TelegramStatusCardProps {
  isLinked: boolean;
  isLinking: boolean;
  linkedText: string;
  notLinkedText: string;
  connectText: string;
  disconnectText: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function TelegramStatusCard({
  isLinked,
  isLinking,
  linkedText,
  notLinkedText,
  connectText,
  disconnectText,
  onConnect,
  onDisconnect
}: TelegramStatusCardProps) {
  const colors = useColors();
  return (
    <Card className="p-4 mb-6">
      <Typography
        variant="caption"
        weight="bold"
        color={colors.textSecondary}
        className="mb-3 uppercase tracking-wider"
      >
        Telegram Status
      </Typography>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Send
            size={20}
            color={isLinked ? colors.success : colors.textSecondary}
          />
          <Typography
            variant="body"
            weight="medium"
            className="ml-2"
            color={isLinked ? colors.success : colors.textPrimary}
          >
            {isLinked ? linkedText : notLinkedText}
          </Typography>
        </View>
        {isLinking ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : isLinked ? (
          <Button variant="ghost" size="sm" onPress={onDisconnect}>
            <Typography variant="caption" color={colors.error}>
              {disconnectText}
            </Typography>
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onPress={onConnect}>
            {connectText}
          </Button>
        )}
      </View>
    </Card>
  );
}
