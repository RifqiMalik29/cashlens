import { Button } from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { colors } from "@constants/theme";
import { CheckCircle, XCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, View } from "react-native";

import { usePaymentResultModal } from "./usePaymentResultModal";

interface PaymentResultModalProps {
  status: "success" | "failed" | "idle";
  errorMessage: string | null;
  onDismiss: () => void;
}

export const PaymentResultModal = ({
  status,
  errorMessage,
  onDismiss
}: PaymentResultModalProps) => {
  const { t } = useTranslation();
  usePaymentResultModal(status, onDismiss);

  return (
    <Modal
      visible={status !== "idle"}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: 32 }}
      >
        <View
          className="w-full rounded-2xl items-center"
          style={{ backgroundColor: "#fff", padding: 32, gap: 16 }}
        >
          {status === "success" ? (
            <>
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <CheckCircle size={48} color={colors.primary} />
              </View>
              <Typography
                variant="h3"
                weight="bold"
                color={colors.textPrimary}
                style={{ textAlign: "center" }}
              >
                {t("upgrade.payment.successTitle")}
              </Typography>
              <Typography
                variant="body"
                color={colors.textSecondary}
                style={{ textAlign: "center" }}
              >
                {t("upgrade.payment.successSubtitle")}
              </Typography>
            </>
          ) : (
            <>
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: "#FEF2F2" }}
              >
                <XCircle size={48} color={colors.error} />
              </View>
              <Typography
                variant="h3"
                weight="bold"
                color={colors.textPrimary}
                style={{ textAlign: "center" }}
              >
                {t("upgrade.payment.failedTitle")}
              </Typography>
              <Typography
                variant="body"
                color={colors.textSecondary}
                style={{ textAlign: "center" }}
              >
                {errorMessage ?? t("upgrade.payment.failedSubtitle")}
              </Typography>
              <Button onPress={onDismiss} fullWidth>
                {t("upgrade.payment.tryAgain")}
              </Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
