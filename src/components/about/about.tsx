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

import { GlassButton } from "@/components/glass-button";
import { GlassCard } from "@/components/glass-card";
import { BottomTabInset, Colors, Gradients, Spacing } from "@/constants/theme";

// Placeholder data — replace with the signed-in user's details
const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  stats: [
    { label: "Courses", value: "12" },
    { label: "Completed", value: "5" },
    { label: "Hours", value: "48" },
  ],
};

type MenuItem = { label: string; icon: SymbolViewProps["name"] };

const menu: MenuItem[] = [
  { label: "Personal info", icon: { ios: "person.text.rectangle", android: "badge" } },
  { label: "Notifications", icon: { ios: "bell.fill", android: "notifications" } },
  { label: "Privacy & security", icon: { ios: "lock.fill", android: "lock" } },
  { label: "Help & support", icon: { ios: "questionmark.circle.fill", android: "help" } },
];

const initials = user.name
  .split(" ")
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export default function ProfileScreen() {
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
      <View style={styles.header}>
        <View style={[styles.avatarRing, { boxShadow: avatarShadow }]}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user.email}
        </Text>
      </View>

      <GlassCard style={styles.stats}>
        {user.stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.textSecondary }]} />}
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          </Fragment>
        ))}
      </GlassCard>

      <GlassCard style={styles.menu}>
        {menu.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <View style={[styles.rowDivider, { backgroundColor: colors.textSecondary }]} />}
            <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              <View style={[styles.rowIcon, { backgroundColor: colors.accentSoft }]}>
                <SymbolView name={item.icon} size={18} tintColor={colors.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
              <SymbolView
                name={{ ios: "chevron.right", android: "chevron_right" }}
                size={16}
                tintColor={colors.textSecondary}
              />
            </Pressable>
          </Fragment>
        ))}
      </GlassCard>

      <GlassButton title="Edit profile" onPress={() => {}} />

      <Pressable style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const avatarShadow = "0px 10px 30px rgba(32, 138, 239, 0.35)";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignItems: "center",
    gap: Spacing.one,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    marginBottom: Spacing.two,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: "linear-gradient(135deg, #208AEF 0%, #8B5CF6 100%)",
  },
  initials: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
  },
  email: {
    fontSize: 15,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.four,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.half,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    opacity: 0.4,
  },
  menu: {
    paddingVertical: Spacing.one,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 36 + Spacing.three,
    opacity: 0.3,
  },
  logout: {
    alignSelf: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  logoutText: {
    color: "#E5484D",
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6,
  },
});
