import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { StyleSheet, useColorScheme, View, type ViewProps } from "react-native";

import { Spacing } from "@/constants/theme";

const hasLiquidGlass = isLiquidGlassAvailable();

export function GlassCard({ style, children, ...props }: ViewProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <View style={[styles.shadow, { boxShadow: shadows[scheme] }]}>
      <GlassView
        glassEffectStyle="regular"
        style={[
          styles.card,
          // GlassView is a plain view without Liquid Glass (Android, web, iOS < 26)
          !hasLiquidGlass && styles[scheme === "dark" ? "fallbackDark" : "fallbackLight"],
          style,
        ]}
        {...props}
      >
        {children}
      </GlassView>
    </View>
  );
}

const shadows = {
  light: "0px 8px 24px rgba(32, 138, 239, 0.18), 0px 2px 6px rgba(0, 0, 0, 0.06)",
  dark: "0px 8px 24px rgba(0, 0, 0, 0.5), 0px 2px 6px rgba(0, 0, 0, 0.3)",
};

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 24,
  },
  card: {
    borderRadius: 24,
    padding: Spacing.three,
    overflow: "hidden",
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
  },
  fallbackDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
  },
});
