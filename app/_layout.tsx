import "../global.css";

import { CustomHeader, SyncOverlay } from "@components/ui";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCloudSync } from "@/hooks/useCloudSync";
import { useEmailConfirmation } from "@/hooks/useEmailConfirmation";
import { useSessionRestore } from "@/hooks/useSessionRestore";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import i18n, { initI18n } from "@/services/i18n";
import { useAuthStore } from "@/stores/useAuthStore";

// Initialize i18n
initI18n();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isOnboarded, preferences } = useAuthStore();
  const { isInitialPull } = useSyncStatus();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Restore Supabase session on app startup
  useSessionRestore();

  // Initialize cloud sync
  useCloudSync();

  // Handle email confirmation deep links
  useEmailConfirmation();

  // Sync language preference from store
  useEffect(() => {
    if (preferences.language && preferences.language !== i18n.language) {
      i18n.changeLanguage(preferences.language);
    }
  }, [preferences.language]);

  useEffect(() => {
    setIsLayoutReady(true);
  }, []);

  useEffect(() => {
    if (!isLayoutReady) return;
    if (!isOnboarded) {
      router.replace("/(auth)/onboarding");
    } else if (!isAuthenticated && segments[0] !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && segments[0] === "(auth)") {
      router.replace("/(tabs)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLayoutReady, isAuthenticated, isOnboarded, segments]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <Stack
          screenOptions={{
            header: ({ options, navigation, back }) => (
              <CustomHeader
                title={options.title}
                showBack={!!back}
                onBack={navigation.goBack}
                rightElement={options.headerRight?.({
                  canGoBack: !!back
                })}
              />
            )
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>

      <SyncOverlay isVisible={isAuthenticated && isInitialPull} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
