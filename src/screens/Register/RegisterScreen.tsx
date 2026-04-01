import { Button, Input, Typography } from "@components/ui";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
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

import { useRegister } from "./useRegister";

export default function RegisterScreen() {
  const {
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
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoToLogin}>
              <ChevronLeft size={24} color="#1A1A2E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Buat Akun</Text>
          </View>

          <Text style={styles.subtitle}>Daftar untuk mulai mencatat</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.inputSpacing}>
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

            <View style={styles.inputSpacing}>
              <Input
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                rightElement={
                  <TouchableOpacity onPress={toggleShowConfirmPassword}>
                    {showConfirmPassword ? (
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
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              style={styles.registerButton}
            >
              Daftar
            </Button>
          </View>

          <View style={styles.bottomRow}>
            <Typography style={{ color: "#6B7280" }}>
              Sudah punya akun?{" "}
            </Typography>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Typography
                variant="body"
                weight="semibold"
                style={{ color: "#4CAF82" }}
              >
                Masuk
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing[4],
    marginBottom: spacing[6]
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginLeft: 8
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: spacing[8]
  },
  form: {
    marginTop: spacing[2]
  },
  inputSpacing: {
    marginTop: spacing[4]
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: spacing[2]
  },
  registerButton: {
    marginTop: spacing[6]
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing[6]
  }
});
