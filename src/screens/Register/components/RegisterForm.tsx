import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Typography } from "@components/ui/Typography";
import { spacing } from "@constants/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface RegisterFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onRegister: () => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export function RegisterForm({
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
  onRegister,
  onTogglePassword,
  onToggleConfirmPassword
}: RegisterFormProps) {
  return (
    <View className="mt-8">
      <Input
        label="Nama"
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <View style={{ marginTop: spacing[4] }}>
        <Input
          label="Email"
          placeholder="nama@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={{ marginTop: spacing[4] }}>
        <Input
          label="Kata Sandi"
          placeholder="Minimal 8 karakter"
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

      <View style={{ marginTop: spacing[4] }}>
        <Input
          label="Konfirmasi Kata Sandi"
          placeholder="Ulangi kata sandi"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          rightElement={
            <TouchableOpacity onPress={onToggleConfirmPassword}>
              {showConfirmPassword ? (
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
        onPress={onRegister}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        style={{ marginTop: spacing[6] }}
      >
        Daftar
      </Button>
    </View>
  );
}
