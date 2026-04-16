import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Typography } from "@components/ui/Typography";
import { colors, spacing } from "@constants/theme";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface CheckEmailFormProps {
  otp: string;
  onOtpChange: (value: string) => void;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  successMessage: string | null;
  onVerify: () => void;
  onResend: () => void;
}

export function CheckEmailForm({
  otp,
  onOtpChange,
  isLoading,
  isResending,
  error,
  successMessage,
  onVerify,
  onResend
}: CheckEmailFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3">
          <Typography
            variant="caption"
            color={colors.error}
            style={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        </View>
      )}
      {successMessage && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-3">
          <Typography
            variant="caption"
            color="#10B981"
            style={{ textAlign: "center" }}
          >
            {successMessage}
          </Typography>
        </View>
      )}

      <Input
        label={t("auth.verificationCode")}
        placeholder={t("auth.otpPlaceholder")}
        value={otp}
        onChangeText={(text) =>
          onOtpChange(text.replace(/[^0-9]/g, "").slice(0, 6))
        }
        keyboardType="numeric"
        autoCapitalize="none"
      />

      <Button onPress={onVerify} loading={isLoading}>
        {t("auth.verifyEmail")}
      </Button>

      <View
        className="flex-row justify-center items-center"
        style={{ gap: spacing[1] }}
      >
        <Typography variant="caption" color={colors.textSecondary}>
          {t("auth.notReceivedCode")}
        </Typography>
        <Button variant="ghost" onPress={onResend} loading={isResending}>
          {t("auth.resend")}
        </Button>
      </View>
    </View>
  );
}
