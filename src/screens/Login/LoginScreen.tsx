import { AuthFooter } from "@components/auth/AuthFooter";
import { AuthLogo } from "@components/auth/AuthLogo";
import { spacing } from "@constants/theme";
import { useGoogleSignIn } from "@hooks/useGoogleSignIn";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./useLogin";

export default function LoginScreen() {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showPassword,
    handleLogin,
    handleGoToRegister,
    toggleShowPassword
  } = useLogin();

  const {
    handleGoogleSignIn,
    isLoading: isGoogleLoading,
    error: googleError
  } = useGoogleSignIn();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing[6],
            paddingBottom: spacing[8]
          }}
        >
          <View className="flex-1 justify-center">
            <AuthLogo />
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              isGoogleLoading={isGoogleLoading}
              error={error || googleError}
              showPassword={showPassword}
              onLogin={handleLogin}
              onTogglePassword={toggleShowPassword}
              onGoogleSignIn={handleGoogleSignIn}
            />
            <AuthFooter
              questionText={t("auth.noAccount") + " "}
              actionText={t("auth.register")}
              onActionPress={handleGoToRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
