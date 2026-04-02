import { FlatList, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomControls } from "./components/BottomControls";
import { OnboardingSlide } from "./components/OnboardingSlide";
import { PaginationDots } from "./components/PaginationDots";
import { SkipButton } from "./components/SkipButton";
import { useOnboarding } from "./useOnboarding";

export default function OnboardingScreen() {
  const {
    activeIndex,
    flatListRef,
    handleNext,
    handleSkip,
    handleScroll,
    slides
  } = useOnboarding();

  const { height, width } = useWindowDimensions();
  const iconSize = height * 0.11;

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <OnboardingSlide
      title={item.title}
      subtitle={item.subtitle}
      iconName={item.iconName}
      iconSize={iconSize}
      screenWidth={width}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {activeIndex < 2 && <SkipButton onPress={handleSkip} />}

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View>
        <PaginationDots activeIndex={activeIndex} totalSlides={slides.length} />
        <BottomControls activeIndex={activeIndex} onNext={handleNext} />
      </View>
    </SafeAreaView>
  );
}
