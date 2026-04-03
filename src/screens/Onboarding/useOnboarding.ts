import { useAuthStore } from "@stores/useAuthStore";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import { useWindowDimensions } from "react-native";

import { ONBOARDING_SLIDES } from "./onboardingSlides";

export function useOnboarding() {
  const router = useRouter();
  const { setOnboarded } = useAuthStore();
  const { height, width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const iconSize = useMemo(() => height * 0.11, [height]);

  const handleNext = () => {
    if (activeIndex < 2) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      setOnboarded(true);
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    setOnboarded(true);
    router.replace("/(auth)/login");
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x /
          event.nativeEvent.layoutMeasurement.width
      );
      setActiveIndex(index);
    },
    []
  );

  return {
    activeIndex,
    flatListRef,
    handleNext,
    handleSkip,
    handleScroll,
    slides: ONBOARDING_SLIDES,
    iconSize,
    screenWidth: width
  };
}
