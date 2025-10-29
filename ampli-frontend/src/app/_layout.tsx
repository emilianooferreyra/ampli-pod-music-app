import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import CustomSplashScreen from "@/components/ui/splash-screen";
import { AppNotification } from "@/components/ui/app-notification";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(main)";

    if (!inOnboardingGroup && !inAuthGroup && !inAppGroup) {
      router.replace("/(onboarding)");
    }

    setTimeout(() => setIsNavigationReady(true), 1);
  }, [segments, router]);

  if (!isNavigationReady) {
    return <CustomSplashScreen />;
  }

  return (
    <>
      <Slot />
      <AppNotification />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
