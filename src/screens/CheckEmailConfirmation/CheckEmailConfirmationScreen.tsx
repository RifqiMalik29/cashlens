import { AuthFooter } from "@components/auth/AuthFooter";
import { AuthLogo } from "@components/auth/AuthLogo";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckEmailForm } from "./components/CheckEmailForm";
import { useCheckEmailConfirmation } from "./useCheckEmailConfirmation";

export default function CheckEmailConfirmationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const {
    isLoading,
    error,
    successMessage,
    handleResendConfirmation,
    handleGoToLogin
  } = useCheckEmailConfirmation(email);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <AuthLogo />

        <View className="mt-8">
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            Check Your Email
          </Text>
          <Text className="text-base text-muted-foreground text-center mb-6">
            We&apos;ve sent a confirmation email to
          </Text>
          {email && (
            <Text className="text-base font-semibold text-primary text-center mb-6">
              {email}
            </Text>
          )}
        </View>

        <CheckEmailForm
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
          onResendConfirmation={handleResendConfirmation}
        />

        <AuthFooter
          questionText="Already confirmed? "
          actionText="Log In"
          onActionPress={handleGoToLogin}
        />
      </View>
    </SafeAreaView>
  );
}
