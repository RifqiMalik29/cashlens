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
  error: string | null;
  showPassword: boolean;
  onLogin: () => void;
  onTogglePassword: () => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  error,
  showPassword,
  onLogin,
  onTogglePassword
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
        disabled={isLoading}
        fullWidth
        style={{ marginTop: spacing[6] }}
      >
        {t("auth.login")}
      </Button>
    </View>
  );
}
