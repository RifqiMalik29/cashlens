import { AuthFooter } from "@components/auth/AuthFooter";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckEmailForm } from "./components/CheckEmailForm";
import { useCheckEmailConfirmation } from "./useCheckEmailConfirmation";

export default function CheckEmailConfirmationScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();

  const {
    otp,
    setOtp,
    isLoading,
    isResending,
    error,
    successMessage,
    handleVerifyOtp,
    handleResendOtp,
    handleGoToLogin
  } = useCheckEmailConfirmation(email);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <View className="mt-8">
          <Typography
            variant="h3"
            weight="bold"
            color={colors.textPrimary}
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            {t("auth.checkEmail")}
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            {t("auth.otpSentTo")}
          </Typography>
          {email && (
            <Typography
              variant="body"
              weight="semibold"
              color={colors.primary}
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              {email}
            </Typography>
          )}
        </View>

        <CheckEmailForm
          otp={otp}
          onOtpChange={setOtp}
          isLoading={isLoading}
          isResending={isResending}
          error={error}
          successMessage={successMessage}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />

        <AuthFooter
          questionText={t("auth.hasAccount") + " "}
          actionText={t("auth.login")}
          onActionPress={handleGoToLogin}
        />
      </View>
    </SafeAreaView>
  );
}
