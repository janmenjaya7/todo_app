import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import {
  defaultTabsSlotRender,
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import {
  createContext,
  use,
  useEffect,
  useRef,
  type ComponentRef,
  type PropsWithChildren,
  type Ref,
} from "react";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  type LayoutRectangle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Spacing } from "@/constants/theme";

const hasLiquidGlass = isLiquidGlassAvailable();
const spring = { damping: 18, stiffness: 220, mass: 0.8 };

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot
        style={{ flex: 1 }}
        renderFn={(descriptor, options) =>
          defaultTabsSlotRender(
            {
              ...descriptor,
              render: () => (
                <FadeScene isFocused={options.isFocused}>{descriptor.render()}</FadeScene>
              ),
            },
            options
          )
        }
      />
      <TabList asChild>
        <FloatingTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton label="Home" icon={{ ios: "house.fill", android: "home" }} />
          </TabTrigger>
          <TabTrigger name="todo" href="/todo" asChild>
            <TabButton label="Todo" icon={{ ios: "checklist", android: "checklist" }} />
          </TabTrigger>
          <TabTrigger name="contact" href="/contact" asChild>
            <TabButton label="Contact" icon={{ ios: "envelope.fill", android: "mail" }} />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton label="Profile" icon={{ ios: "person.fill", android: "person" }} />
          </TabTrigger>
        </FloatingTabList>
      </TabList>
    </Tabs>
  );
}

/** Fades and lifts a tab's screen in each time it gains focus. */
function FadeScene({ isFocused, children }: PropsWithChildren<{ isFocused: boolean }>) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    if (isFocused) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 280 });
    }
  }, [isFocused, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 12 }],
  }));

  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}

type Indicator = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
};

const IndicatorContext = createContext<Indicator | null>(null);

function FloatingTabList({ children, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  const indicator: Indicator = {
    x: useSharedValue(0),
    y: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicator.width.value,
    height: indicator.height.value,
    transform: [
      { translateX: indicator.x.value },
      { translateY: indicator.y.value },
    ],
  }));

  return (
    <View
      {...props}
      pointerEvents="box-none"
      style={[styles.floating, { bottom: insets.bottom + Spacing.three }]}
    >
      <GlassView
        glassEffectStyle="regular"
        style={[
          styles.bar,
          { boxShadow: shadows[scheme] },
          // GlassView is a plain view without Liquid Glass (Android, iOS < 26)
          !hasLiquidGlass && styles[scheme === "dark" ? "fallbackDark" : "fallbackLight"],
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, { backgroundColor: colors.accentSoft }, indicatorStyle]}
        />
        <IndicatorContext value={indicator}>{children}</IndicatorContext>
      </GlassView>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: SymbolViewProps["name"];
};

function TabButton({ label, icon, isFocused, ref, ...props }: TabButtonProps) {
  const colors = Colors[useColorScheme() === "dark" ? "dark" : "light"];
  const indicator = use(IndicatorContext);
  const frame = useRef<LayoutRectangle | null>(null);
  const hasPlaced = useRef(false);
  const iconScale = useSharedValue(1);

  const moveIndicator = () => {
    if (!indicator || !frame.current) return;
    const { x, y, width, height } = frame.current;
    if (hasPlaced.current) {
      indicator.x.set(withSpring(x, spring));
      indicator.width.set(withSpring(width, spring));
    } else {
      // First placement: jump into position instead of sliding in from 0
      indicator.x.set(x);
      indicator.width.set(width);
    }
    indicator.y.set(y);
    indicator.height.set(height);
    hasPlaced.current = true;
  };

  useEffect(() => {
    if (!isFocused) return;
    moveIndicator();
    iconScale.value = withSequence(
      withTiming(1.22, { duration: 140 }),
      withSpring(1, { damping: 10, stiffness: 260 })
    );
    // moveIndicator only reads refs and shared values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const color = isFocused ? colors.accent : colors.textSecondary;

  return (
    <Pressable
      {...props}
      ref={ref as unknown as Ref<ComponentRef<typeof Pressable>>}
      accessibilityLabel={label}
      onLayout={(e) => {
        frame.current = e.nativeEvent.layout;
        if (isFocused) moveIndicator();
      }}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
    >
      <Animated.View style={iconStyle}>
        <SymbolView name={icon} size={22} tintColor={color} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          { color, fontWeight: isFocused ? "700" : "500" },
          styles.labelTransition,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const shadows = {
  light: "0px 10px 30px rgba(32, 138, 239, 0.22), 0px 2px 8px rgba(0, 0, 0, 0.08)",
  dark: "0px 10px 30px rgba(0, 0, 0, 0.6), 0px 2px 8px rgba(0, 0, 0, 0.4)",
};

const styles = StyleSheet.create({
  floating: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    padding: Spacing.two,
    borderRadius: 999,
  },
  fallbackLight: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  fallbackDark: {
    backgroundColor: "rgba(40, 42, 46, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 999,
  },
  tab: {
    width: 72,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
  },
  labelTransition: {
    transitionProperty: "color",
    transitionDuration: 220,
  },
  pressed: {
    opacity: 0.7,
  },
});
