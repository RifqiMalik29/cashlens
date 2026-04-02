import { Stack } from "expo-router";

export default function TransactionsStack() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#F7FAF8" }
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          title: "Tambah Transaksi",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Transaksi",
          headerShown: true
        }}
      />
    </Stack>
  );
}
