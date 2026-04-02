/* eslint-disable max-lines */

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Mail,
  Palette
} from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SyncStatusButton } from "@/components/ui/SyncIndicator";
import { Typography } from "@/components/ui/Typography";
import { currencies } from "@/constants/currencies";
import { spacing } from "@/constants/theme";
import { useCloudSync } from "@/hooks/useCloudSync";
import { signOut } from "@/services/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

interface SettingsItemProps {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  danger
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white border border-border rounded-lg px-4 py-3"
      activeOpacity={0.7}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Typography
          variant="body"
          weight="medium"
          color={danger ? "#EF4444" : "#1A1A2E"}
        >
          {label}
        </Typography>
      </View>
      {value && (
        <Typography variant="body" color="#6B7280" style={{ marginRight: 8 }}>
          {value}
        </Typography>
      )}
      <ChevronRight size={20} color={danger ? "#EF4444" : "#9CA3AF"} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { reset, preferences } = useAuthStore();
  const { pullData } = useCloudSync();

  const handleSignOut = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await signOut();
    reset();
    router.replace("/(auth)/login");
  };

  const handleForceSync = async () => {
    await Haptics.selectionAsync();
    await pullData();
  };

  const handleCurrencyPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/currency");
  };

  const handleCategoriesPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/categories");
  };

  const handleLanguagePress = async () => {
    await Haptics.selectionAsync();
    const newLang = preferences.language === "id" ? "en" : "en";
    useAuthStore.getState().updatePreferences({ language: newLang });
  };

  const handleThemePress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/theme");
  };

  const handleHelpPress = async () => {
    await Haptics.selectionAsync();
    router.push("/(tabs)/settings/help");
  };

  const currency = currencies.find((c) => c.code === preferences.baseCurrency);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing[8] }}
      >
        <View className="px-6 pt-6 pb-4">
          <Typography variant="h2" weight="bold">
            Pengaturan
          </Typography>
          <Typography variant="body" color="#6B7280">
            Kelola preferensi aplikasi
          </Typography>
        </View>

        <View className="px-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Cloud Sync
          </Typography>
          <SyncStatusButton onPress={handleForceSync} />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Profil
          </Typography>
          <SettingsItem
            icon={<Mail size={20} color="#4CAF82" />}
            label="Email"
            value="user@example.com"
          />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Keuangan
          </Typography>
          <SettingsItem
            icon={<CreditCard size={20} color="#4CAF82" />}
            label="Mata Uang Dasar"
            value={currency?.code || "IDR"}
            onPress={handleCurrencyPress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<LayoutGrid size={20} color="#4CAF82" />}
              label="Kelola Kategori"
              onPress={handleCategoriesPress}
            />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Preferensi
          </Typography>
          <SettingsItem
            icon={<Globe size={20} color="#4CAF82" />}
            label="Bahasa"
            value={preferences.language === "id" ? "Indonesia" : "English"}
            onPress={handleLanguagePress}
          />
          <View style={{ marginTop: spacing[3] }}>
            <SettingsItem
              icon={<Palette size={20} color="#4CAF82" />}
              label="Tema"
              value={
                preferences.theme === "system"
                  ? "Sistem"
                  : preferences.theme === "light"
                    ? "Terang"
                    : "Gelap"
              }
              onPress={handleThemePress}
            />
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Bantuan
          </Typography>
          <SettingsItem
            icon={<HelpCircle size={20} color="#4CAF82" />}
            label="Pusat Bantuan"
            onPress={handleHelpPress}
          />
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Akun
          </Typography>
          <SettingsItem
            icon={<LogOut size={20} color="#EF4444" />}
            label="Keluar dari Akun"
            danger
            onPress={handleSignOut}
          />
          <View className="bg-surface-secondary rounded-lg p-4 mt-3">
            <Typography variant="caption" color="#6B7280">
              Anda akan keluar dari akun dan kembali ke layar login.
            </Typography>
          </View>
        </View>

        <View className="px-6 mt-6">
          <Typography
            variant="label"
            weight="medium"
            color="#6B7280"
            style={{ marginBottom: spacing[2] }}
          >
            Tentang
          </Typography>
          <View className="bg-white border border-border rounded-lg px-4 py-3">
            <Typography variant="body" weight="medium" color="#1A1A2E">
              CashLens
            </Typography>
            <Typography variant="caption" color="#6B7280">
              Versi 1.0.0
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
