import { AuthFooter } from "@components/auth/AuthFooter";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckEmailForm } from "./components/CheckEmailForm";
import { useCheckEmailConfirmation } from "./useCheckEmailConfirmation";

export default function CheckEmailConfirmationScreen() {
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
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            Cek Email Kamu
          </Text>
          <Text className="text-base text-muted-foreground text-center mb-2">
            Kami telah mengirim kode 6 digit ke
          </Text>
          {email && (
            <Text className="text-base font-semibold text-primary text-center mb-6">
              {email}
            </Text>
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
          questionText="Sudah punya akun? "
          actionText="Masuk"
          onActionPress={handleGoToLogin}
        />
      </View>
    </SafeAreaView>
  );
}
