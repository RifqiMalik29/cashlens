import { Stack } from "expo-router";

export default function FormsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        header: () => null
      }}
    >
      <Stack.Screen name="budget-add" />
      <Stack.Screen name="budget-edit" />
    </Stack>
  );
}
