import "../global.css";

import { CustomHeader } from "@components/ui";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
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
