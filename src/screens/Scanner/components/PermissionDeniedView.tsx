import { Button } from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { SafeAreaView } from "react-native-safe-area-context";

interface PermissionDeniedViewProps {
  onRequestPermission: () => void;
}

export function PermissionDeniedView({
  onRequestPermission
}: PermissionDeniedViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
      <Typography
        variant="h3"
        weight="bold"
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        Izin Kamera Diperlukan
      </Typography>
      <Typography
        variant="body"
        color="#6B7280"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        CashLens memerlukan akses kamera untuk memindai struk transaksi Anda.
      </Typography>
      <Button onPress={onRequestPermission} variant="primary" size="lg">
        Beri Izin Kamera
      </Button>
    </SafeAreaView>
  );
}
