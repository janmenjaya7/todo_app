import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";

const hasLiquidGlass = isLiquidGlassAvailable();

type GlassButtonProps = {
  title: string;
  onPress: () => void;
};

export function GlassButton({ title, onPress }: GlassButtonProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.shadow,
        { boxShadow: scheme === "dark" ? darkShadow : lightShadow },
        pressed && styles.pressed,
      ]}
    >
      <GlassView
        isInteractive
        glassEffectStyle="regular"
        tintColor={colors.accentSoft}
        style={[
          styles.glass,
          // GlassView is a plain view without Liquid Glass (Android, web, iOS < 26)
          !hasLiquidGlass && (scheme === "dark" ? styles.fallbackDark : styles.fallbackLight),
        ]}
      >
        <ThemedText type="smallBold" style={{ color: colors.text }}>
          {title}
        </ThemedText>
      </GlassView>
    </Pressable>
  );
}

const lightShadow = "0px 8px 24px rgba(32, 138, 239, 0.25), 0px 2px 6px rgba(0, 0, 0, 0.08)";
const darkShadow = "0px 8px 24px rgba(0, 0, 0, 0.5), 0px 2px 6px rgba(0, 0, 0, 0.3)";

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  glass: {
    borderRadius: 999,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: "center",
    overflow: "hidden",
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  fallbackDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
});
