import { View } from "react-native";

import { Typography } from "../ui";

export function ScannerOverlay() {
  return (
    <View className="absolute inset-0 items-center justify-center">
      <View className="relative">
        <View
          className="border-2 border-primary"
          style={{
            width: 280,
            height: 380,
            borderRadius: 16,
            backgroundColor: "transparent"
          }}
        >
          <View
            className="absolute -top-1 -left-1 border-t-4 border-l-4 border-primary rounded-tl-lg"
            style={{ width: 40, height: 40 }}
          />
          <View
            className="absolute -top-1 -right-1 border-t-4 border-r-4 border-primary rounded-tr-lg"
            style={{ width: 40, height: 40 }}
          />
          <View
            className="absolute -bottom-1 -left-1 border-b-4 border-l-4 border-primary rounded-bl-lg"
            style={{ width: 40, height: 40 }}
          />
          <View
            className="absolute -bottom-1 -right-1 border-b-4 border-r-4 border-primary rounded-br-lg"
            style={{ width: 40, height: 40 }}
          />
        </View>

        <View
          className="absolute -inset-8 border border-primary-light rounded-3xl opacity-30"
          style={{ width: 344, height: 444 }}
        />
      </View>

      <View className="mt-8 px-6">
        <View className="bg-primary-light px-4 py-2 rounded-full">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 bg-primary rounded-full" />
            <View className="text-sm font-semibold text-primary">
              <Typography>Posisikan struk dalam bingkai</Typography>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
