import { router, type Href } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Fragment } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/glass-card";
import { BottomTabInset, Colors, Gradients, Spacing } from "@/constants/theme";

// Placeholder data — replace with real content
const featured = {
  title: "React Native Fundamentals",
  lesson: "Lesson 8 · Navigation basics",
  progress: 0.65,
};

type CardPalette = { gradient: string; tint: string };

type QuickAction = {
  label: string;
  icon: SymbolViewProps["name"];
  href?: Href;
  light: CardPalette;
  dark: CardPalette;
};

const quickActions: QuickAction[] = [
  {
    label: "Profile",
    icon: { ios: "person.fill", android: "person" },
    href: "/profile",
    light: {
      gradient: "linear-gradient(135deg, #E0F0FF 0%, #C7E2FF 100%)",
      tint: "#208AEF",
    },
    dark: {
      gradient: "linear-gradient(135deg, #1B3A5C 0%, #12263D 100%)",
      tint: "#6CB4FF",
    },
  },
  {
    label: "Contact",
    icon: { ios: "envelope.fill", android: "mail" },
    href: "/contact",
    light: {
      gradient: "linear-gradient(135deg, #FFE4EC 0%, #FFD1DC 100%)",
      tint: "#E5487A",
    },
    dark: {
      gradient: "linear-gradient(135deg, #4A2233 0%, #2E1520 100%)",
      tint: "#FF8FB1",
    },
  },
  {
    label: "Courses",
    icon: { ios: "book.fill", android: "menu_book" },
    light: {
      gradient: "linear-gradient(135deg, #DFF7EC 0%, #C3EFD9 100%)",
      tint: "#1F9D63",
    },
    dark: {
      gradient: "linear-gradient(135deg, #1C3D30 0%, #11261E 100%)",
      tint: "#5FD49C",
    },
  },
  {
    label: "Schedule",
    icon: { ios: "calendar", android: "calendar_month" },
    light: {
      gradient: "linear-gradient(135deg, #EDE7FF 0%, #DCD0FF 100%)",
      tint: "#7C5CF6",
    },
    dark: {
      gradient: "linear-gradient(135deg, #2E2552 0%, #1C1736 100%)",
      tint: "#A995FF",
    },
  },
];

const announcements = [
  { title: "New course: Advanced TypeScript", time: "2h ago" },
  { title: "Live session on Friday at 5 PM", time: "Yesterday" },
];

const ACTION_CARD_WIDTH = 140;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ experimental_backgroundImage: Gradients[scheme] }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}
    >
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          {greeting()},
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Janmenjaya 👋
        </Text>
      </View>

      <GlassCard style={styles.featured}>
        <Text style={[styles.eyebrow, { color: colors.accent }]}>
          CONTINUE LEARNING
        </Text>
        <Text style={[styles.featuredTitle, { color: colors.text }]}>
          {featured.title}
        </Text>
        <Text style={[styles.muted, { color: colors.textSecondary }]}>
          {featured.lesson}
        </Text>
        <View style={[styles.track, { backgroundColor: colors.accentSoft }]}>
          <View
            style={[styles.fill, { width: `${featured.progress * 100}%` }]}
          />
        </View>
        <Text style={[styles.muted, { color: colors.textSecondary }]}>
          {Math.round(featured.progress * 100)}% complete
        </Text>
      </GlassCard>

      <Text style={[styles.section, { color: colors.text }]}>
        Quick actions
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ACTION_CARD_WIDTH + Spacing.three}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
      >
        {quickActions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => action.href && router.push(action.href)}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.actionCard,
                scheme === "dark"
                  ? styles.actionCardDark
                  : styles.actionCardLight,
                { experimental_backgroundImage: action[scheme].gradient },
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  scheme === "dark"
                    ? styles.iconBadgeDark
                    : styles.iconBadgeLight,
                ]}
              >
                <SymbolView
                  name={action.icon}
                  size={22}
                  tintColor={action[scheme].tint}
                />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[styles.section, { color: colors.text }]}>
        Announcements
      </Text>
      <GlassCard style={styles.list}>
        {announcements.map((item, i) => (
          <Fragment key={item.title}>
            {i > 0 && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.textSecondary },
                ]}
              />
            )}
            <View style={styles.listRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.listTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.muted, { color: colors.textSecondary }]}>
                {item.time}
              </Text>
            </View>
          </Fragment>
        ))}
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  featured: {
    gap: Spacing.two,
    padding: Spacing.four,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  muted: {
    fontSize: 13,
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: Spacing.two,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    experimental_backgroundImage:
      "linear-gradient(90deg, #208AEF 0%, #8B5CF6 100%)",
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: -Spacing.two,
  },
  grid: {
    // Bleed to the screen edges; vertical padding keeps card shadows from being clipped
    marginHorizontal: -Spacing.four,
    marginVertical: -Spacing.three,
  },
  gridContent: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  gridItem: {
    width: ACTION_CARD_WIDTH,
  },
  actionCard: {
    gap: Spacing.three,
    padding: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: 24,
    borderWidth: 1,
  },
  actionCardLight: {
    borderColor: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "0px 8px 20px rgba(32, 138, 239, 0.15), 0px 2px 6px rgba(0, 0, 0, 0.06)",
  },
  actionCardDark: {
    borderColor: "rgba(255, 255, 255, 0.08)",
    boxShadow:
      "0px 8px 20px rgba(0, 0, 0, 0.45), 0px 2px 6px rgba(0, 0, 0, 0.3)",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeLight: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  iconBadgeDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingVertical: Spacing.one,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  listTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 8 + Spacing.three,
    opacity: 0.3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
