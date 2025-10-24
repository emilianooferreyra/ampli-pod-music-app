import { defaultConfig } from "@tamagui/config/v4";
import { createFont, createTamagui } from "tamagui";

const geistFont = createFont({
  family: "Geist",
  size: {
    1: 10,
    2: 11,
    3: 12,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 30,
    10: 36,
    11: 48,
    12: 60,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 24,
    6: 26,
    7: 28,
    8: 32,
    9: 38,
    10: 44,
    11: 56,
    12: 68,
  },
  weight: {
    1: "300",
    4: "400",
    6: "500",
    7: "600",
    9: "700",
  },
  letterSpacing: {
    4: 0,
    5: 0,
  },
  face: {
    300: { normal: "Geist_300Light" },
    400: { normal: "Geist_400Regular" },
    500: { normal: "Geist_500Medium" },
    600: { normal: "Geist_600SemiBold" },
    700: { normal: "Geist_700Bold" },
  },
});

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  fonts: {
    heading: geistFont,
    body: geistFont,
  },
});

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
