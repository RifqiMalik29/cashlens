import { ScanLine, Target, Wallet } from "lucide-react-native";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { heights, spacing } from "@/constants/theme";

import { useOnboarding } from "./useOnboarding";

type IconComponent = typeof Wallet;
const ICON_MAP: Record<string, IconComponent> = {
  Wallet,
  ScanLine,
  Target
};

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

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => {
    const IconComponent = ICON_MAP[item.iconName];

    return (
      <View style={[styles.slide, { width }]}>
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.slideContent}
        >
          <IconComponent size={iconSize} color="#4CAF82" />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {activeIndex < 2 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      )}

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

      <View style={styles.bottomArea}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: index === activeIndex ? 24 : 8,
                  backgroundColor: index === activeIndex ? "#4CAF82" : "#E8F5EE"
                }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {activeIndex === 2 ? "Mulai Sekarang" : "Selanjutnya"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8"
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    right: 24,
    zIndex: 10
  },
  skipText: {
    color: "#6B7280",
    fontSize: 15
  },
  slide: {
    flex: 1
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginTop: spacing[6],
    textAlign: "center"
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: spacing[3]
  },
  bottomArea: {
    alignItems: "center",
    paddingBottom: spacing[8]
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: spacing[6]
  },
  dot: {
    height: heights.dotIndicator,
    borderRadius: 4
  },
  button: {
    backgroundColor: "#4CAF82",
    borderRadius: 10,
    height: heights.buttonLg,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
