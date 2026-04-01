import { Button, Input, Typography } from "@components/ui";
import { Eye, EyeOff, Wallet } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/constants/theme";

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoArea}>
            <Wallet size={48} color="#4CAF82" />
            <Text style={styles.title}>CashLens</Text>
            <Text style={styles.subtitle}>Kelola keuanganmu dengan cerdas</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <Input
                label="Kata Sandi"
                placeholder="Minimal 6 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity onPress={toggleShowPassword}>
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                }
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              style={styles.loginButton}
            >
              Masuk
            </Button>
          </View>

          <View style={styles.bottomRow}>
            <Typography style={{ color: "#6B7280" }}>
              Belum punya akun?{" "}
            </Typography>
            <TouchableOpacity onPress={handleGoToRegister}>
              <Typography
                variant="body"
                weight="semibold"
                style={{ color: "#4CAF82" }}
              >
                Daftar
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8"
  },
  keyboardView: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: spacing[8]
  },
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing[10],
    paddingBottom: spacing[6]
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginTop: spacing[3]
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: spacing[1]
  },
  form: {
    marginTop: spacing[2]
  },
  passwordContainer: {
    marginTop: spacing[4]
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: spacing[2]
  },
  loginButton: {
    marginTop: spacing[6]
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing[6]
  }
});
