import { Typography } from "@components/ui";
import { WifiOff } from "lucide-react-native";
import React from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OfflineBannerProps {
  isOnline: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isOnline) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isOnline, fadeAnim]);

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <SafeAreaView edges={["top"]}>
        <View className="bg-red-500 px-4 py-2 flex-row items-center justify-center">
          <WifiOff size={16} color="#ffffff" />
          <Typography
            variant="body"
            color="light"
            className="ml-2 text-sm text-white"
          >
            Tidak ada koneksi internet. Beberapa fitur mungkin tidak berfungsi.
          </Typography>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
