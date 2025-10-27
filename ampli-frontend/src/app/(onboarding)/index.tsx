import { useState, useRef } from "react";
import {
  Dimensions,
  FlatList,
  type ViewToken,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { SvgProps } from "react-native-svg";

import AmpliLogo from "@assets/ampli-logo-white.svg";
import Onboarding1 from "@assets/onboarding-1.svg";
import Onboarding2 from "@assets/onboarding-2.svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  ImageComponent: React.FC<SvgProps>;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Find and listen in your favorite podcast",
    description:
      "Lorem ipsum dolor sit amet consectetur. Egestas vitae nunc consectetur in enim.",
    ImageComponent: Onboarding1,
  },
  {
    id: "2",
    title: "Discover New Content",
    description:
      "Lorem ipsum dolor sit amet consectetur. Egestas vitae nunc consectetur in enim.",
    ImageComponent: Onboarding2,
  },
  {
    id: "3",
    title: "Connect with Creators",
    description:
      "Lorem ipsum dolor sit amet consectetur. Egestas vitae nunc consectetur in enim.",
    ImageComponent: Onboarding1,
  },
  {
    id: "4",
    title: "Start Your Journey",
    description:
      "Lorem ipsum dolor sit amet consectetur. Egestas vitae nunc consectetur in enim.",
    ImageComponent: Onboarding2,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems.length > 0 &&
        viewableItems[0]?.index !== undefined &&
        viewableItems[0]?.index !== null
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    router.replace("/sign-up");
  };

  const renderSlides = ({ item }: { item: OnboardingSlide }) => {
    const { ImageComponent } = item;
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <ImageComponent width="90%" height="100%" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <AmpliLogo width={120} height={40} />
        </View>

        <View style={styles.skipButtonContainer}>
          {currentIndex < slides.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.slidesContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? "#B794F6" : "#4A4A4A",
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  skipButtonContainer: {
    minWidth: 90,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  skipButton: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  slidesContainer: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "100%",
  },
  textContainer: {
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#A0A0A0",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: "#B794F6",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },
});
