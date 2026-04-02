import "../global.css";

import { CustomHeader } from "@components/ui";
import { useAuthStore } from "@stores/useAuthStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isOnboarded } = useAuthStore();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
