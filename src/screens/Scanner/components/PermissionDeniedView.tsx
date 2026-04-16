import { Button } from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

interface PermissionDeniedViewProps {
  onRequestPermission: () => void;
}

export function PermissionDeniedView({
  onRequestPermission
}: PermissionDeniedViewProps) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
      <Typography
        variant="h3"
        weight="bold"
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        {t("scanner.cameraPermission")}
      </Typography>
      <Typography
        variant="body"
        color="#6B7280"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        {t("scanner.cameraPermissionDesc")}
      </Typography>
      <Button onPress={onRequestPermission} variant="primary" size="lg">
        {t("scanner.grantPermission")}
      </Button>
    </SafeAreaView>
  );
}
