import { CustomHeader } from "@components/ui";
import { useColors } from "@hooks/useColors";
import { Stack } from "expo-router";

export default function TransactionsStack() {
  const colors = useColors();
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
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Transaksi"
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Tambah Transaksi"
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Transaksi"
        }}
      />
    </Stack>
  );
}
