import { AuthFooter } from "@components/auth/AuthFooter";
import { AuthLogo } from "@components/auth/AuthLogo";
import { spacing } from "@constants/theme";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./useRegister";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    showPassword,
    showConfirmPassword,
    handleRegister,
    handleGoToLogin,
    toggleShowPassword,
    toggleShowConfirmPassword
  } = useRegister();

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
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isLoading={isLoading}
              error={error}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onRegister={handleRegister}
              onTogglePassword={toggleShowPassword}
              onToggleConfirmPassword={toggleShowConfirmPassword}
            />
            <AuthFooter
              questionText={t("auth.hasAccount") + " "}
              actionText={t("auth.login")}
              onActionPress={handleGoToLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
