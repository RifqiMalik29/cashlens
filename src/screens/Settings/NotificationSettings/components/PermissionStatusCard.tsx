import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { ShieldAlert, ShieldCheck } from "lucide-react-native";
import { View } from "react-native";

interface PermissionStatusCardProps {
  hasPermission: boolean;
  permissionGrantedText: string;
  permissionDeniedText: string;
  fixPermissionButtonText: string;
  onOpenSettings: () => void;
}

export function PermissionStatusCard({
  hasPermission,
  permissionGrantedText,
  permissionDeniedText,
  fixPermissionButtonText,
  onOpenSettings
}: PermissionStatusCardProps) {
  const colors = useColors();
  return (
    <Card className="p-4 mb-6">
      <Typography
        variant="caption"
        weight="bold"
        color={colors.textSecondary}
        className="mb-3 uppercase tracking-wider"
      >
        Permission Status
      </Typography>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {hasPermission ? (
            <ShieldCheck size={20} color={colors.success} />
          ) : (
            <ShieldAlert size={20} color={colors.error} />
          )}
          <Typography
            variant="body"
            weight="medium"
            className="ml-2"
            color={hasPermission ? colors.success : colors.error}
          >
            {hasPermission ? permissionGrantedText : permissionDeniedText}
          </Typography>
        </View>
        {!hasPermission && (
          <Button variant="secondary" size="sm" onPress={onOpenSettings}>
            {fixPermissionButtonText}
          </Button>
        )}
      </View>
    </Card>
  );
}
