import { GoogleSignInButton } from "@components/auth/GoogleSignInButton";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
  showPassword: boolean;
  onLogin: () => void;
  onTogglePassword: () => void;
  onGoogleSignIn: () => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  isGoogleLoading,
  error,
  showPassword,
  onLogin,
  onTogglePassword,
  onGoogleSignIn
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <View className="mt-8">
      <Input
        label={t("auth.email")}
        placeholder={t("auth.emailPlaceholder")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ marginTop: spacing[4] }}>
        <Input
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightElement={
            <TouchableOpacity onPress={onTogglePassword}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          }
        />
      </View>

      {error && (
        <View className="mt-4">
          <Typography variant="caption" color="#EF4444">
            {error}
          </Typography>
        </View>
      )}

      <Button
        onPress={onLogin}
        loading={isLoading}
        disabled={isLoading || isGoogleLoading}
        fullWidth
        style={{ marginTop: spacing[6] }}
      >
        {t("auth.login")}
      </Button>

      <View
        className="flex-row items-center"
        style={{ marginTop: spacing[4], gap: 8 }}
      >
        <View className="flex-1 h-px bg-border" />
        <Typography variant="caption" color="#9CA3AF">
          {t("auth.orContinueWith")}
        </Typography>
        <View className="flex-1 h-px bg-border" />
      </View>

      <GoogleSignInButton
        onPress={onGoogleSignIn}
        isLoading={isGoogleLoading}
        label={t("auth.continueWithGoogle")}
        style={{ marginTop: spacing[3] }}
      />
    </View>
  );
}
