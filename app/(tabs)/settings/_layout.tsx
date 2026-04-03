import { CustomHeader } from "@components/ui";
import { Stack } from "expo-router";

export default function SettingsStack() {
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation, back }) => (
          <CustomHeader
            title={options.title}
            showBack={!!back}
            onBack={navigation.goBack}
            rightElement={options.headerRight?.({ canGoBack: !!back })}
          />
        ),
        contentStyle: { backgroundColor: "#F7FAF8" }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pengaturan"
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: "Kelola Kategori"
        }}
      />
      <Stack.Screen
        name="currency"
        options={{
          title: "Mata Uang Utama"
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: "Bahasa"
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: "Tema Aplikasi"
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Pusat Bantuan"
        }}
      />
    </Stack>
  );
}
