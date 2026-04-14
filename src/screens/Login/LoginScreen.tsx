import { AuthFooter } from "@components/auth/AuthFooter";
import { AuthLogo } from "@components/auth/AuthLogo";
import { spacing } from "@constants/theme";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./useLogin";

export default function LoginScreen() {
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 100}
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
              error={error}
              showPassword={showPassword}
              onLogin={handleLogin}
              onTogglePassword={toggleShowPassword}
            />
            <AuthFooter
              questionText="Belum punya akun? "
              actionText="Daftar"
              onActionPress={handleGoToRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
