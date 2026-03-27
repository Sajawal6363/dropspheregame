/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeColors = {
  light: {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
  dark: {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
};

const themeColors: ThemeColors = {
  light: {
    text: Colors.text.primary,
    background: Colors.background.dark,
    tint: Colors.primary,
    tabIconDefault: Colors.text.muted,
    tabIconSelected: Colors.primary,
  },
  dark: {
    text: Colors.text.primary,
    background: Colors.background.dark,
    tint: Colors.primary,
    tabIconDefault: Colors.text.muted,
    tabIconSelected: Colors.primary,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors["light"] & keyof ThemeColors["dark"],
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[theme][colorName];
  }
}
