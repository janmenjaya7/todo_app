import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/glass-card";
import {
  BottomTabInset,
  Colors,
  Gradients,
  Pastels,
  Spacing,
} from "@/constants/theme";

type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  palette: number;
};

// Sample todos so the list isn't empty on first open — delete freely
const initialTodos: Todo[] = [
  { id: "1", text: "Finish the profile page design", done: false, createdAt: Date.now(), palette: 0 },
  { id: "2", text: "Review pull requests", done: true, createdAt: Date.now(), palette: 1 },
];

const brandGradient = "linear-gradient(135deg, #208AEF 0%, #8B5CF6 100%)";

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TodoScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  const [todos, setTodos] = useState(initialTodos);
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const plusRotation = useSharedValue(0);

  const setComposer = (open: boolean) => {
    setComposerOpen(open);
    plusRotation.set(withSpring(open ? 45 : 0, { damping: 14, stiffness: 200 }));
    if (!open) setDraft("");
  };

  const addTodo = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        done: false,
        createdAt: Date.now(),
        palette: prev.length % Pastels.length,
      },
      ...prev,
    ]);
    setQuery("");
    setComposer(false);
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const search = query.trim().toLowerCase();
  const visible = search
    ? todos.filter((t) => t.text.toLowerCase().includes(search))
    : todos;
  const doneCount = todos.filter((t) => t.done).length;

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${plusRotation.get()}deg` }],
  }));

  const surface = scheme === "dark" ? styles.surfaceDark : styles.surfaceLight;
  const placeholderColor = scheme === "dark" ? "#8B9099" : "#8A8F98";

  return (
    <ScrollView
      style={{ experimental_backgroundImage: Gradients[scheme] }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}
    >
      <View>
        <Text style={[styles.title, { color: colors.text }]}>My Todos</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {todos.length} {todos.length === 1 ? "task" : "tasks"} · {doneCount} done
        </Text>
      </View>

      <View style={styles.toolbar}>
        <View style={[styles.search, surface]}>
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search" }}
            size={18}
            tintColor={colors.textSecondary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search todos"
            placeholderTextColor={placeholderColor}
            selectionColor={colors.accent}
            cursorColor={colors.accent}
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.text }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={10}>
              <SymbolView
                name={{ ios: "xmark.circle.fill", android: "cancel" }}
                size={18}
                tintColor={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => setComposer(!composerOpen)}
          accessibilityLabel={composerOpen ? "Close new todo" : "Add todo"}
          style={({ pressed }) => [styles.plus, pressed && styles.pressed]}
        >
          <Animated.View style={plusStyle}>
            <SymbolView name={{ ios: "plus", android: "add" }} size={24} tintColor="#ffffff" />
          </Animated.View>
        </Pressable>
      </View>

      {composerOpen && (
        <Animated.View
          entering={FadeInDown.springify().damping(16)}
          exiting={FadeOutUp.duration(180)}
          style={[styles.composer, surface]}
        >
          <TextInput
            autoFocus
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addTodo}
            placeholder="What do you need to do?"
            placeholderTextColor={placeholderColor}
            selectionColor={colors.accent}
            cursorColor={colors.accent}
            returnKeyType="done"
            style={[styles.composerInput, { color: colors.text }]}
          />
          <Pressable
            onPress={addTodo}
            disabled={!draft.trim()}
            style={({ pressed }) => [
              styles.addButton,
              !draft.trim() && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </Animated.View>
      )}

      {search.length > 0 && (
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {visible.length} {visible.length === 1 ? "result" : "results"} for “{query.trim()}”
        </Text>
      )}

      <View style={styles.list}>
        {visible.map((todo) => {
          const palette = Pastels[todo.palette][scheme];
          return (
            <Animated.View
              key={todo.id}
              entering={FadeInDown.springify().damping(16)}
              exiting={FadeOut.duration(160)}
              layout={LinearTransition.springify().damping(18)}
              style={[
                styles.card,
                scheme === "dark" ? styles.cardDark : styles.cardLight,
                { experimental_backgroundImage: palette.gradient },
              ]}
            >
              <Pressable
                onPress={() => toggleTodo(todo.id)}
                hitSlop={10}
                accessibilityLabel={todo.done ? "Mark as not done" : "Mark as done"}
                style={[
                  styles.checkbox,
                  { borderColor: palette.tint },
                  todo.done && { backgroundColor: palette.tint },
                ]}
              >
                {todo.done && (
                  <SymbolView
                    name={{ ios: "checkmark", android: "check" }}
                    size={14}
                    tintColor="#ffffff"
                  />
                )}
              </Pressable>

              <View style={styles.cardBody}>
                <Text
                  style={[
                    styles.cardText,
                    { color: colors.text },
                    todo.done && styles.cardTextDone,
                  ]}
                >
                  {todo.text}
                </Text>
                <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                  {formatTime(todo.createdAt)}
                </Text>
              </View>

              <Pressable
                onPress={() => deleteTodo(todo.id)}
                hitSlop={10}
                accessibilityLabel="Delete todo"
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
              >
                <SymbolView
                  name={{ ios: "trash", android: "delete" }}
                  size={18}
                  tintColor={palette.tint}
                />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {visible.length === 0 && (
        <Animated.View entering={FadeInDown}>
          <GlassCard style={styles.empty}>
            <SymbolView
              name={
                search
                  ? { ios: "magnifyingglass", android: "search_off" }
                  : { ios: "checklist", android: "checklist" }
              }
              size={36}
              tintColor={colors.accent}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {search ? "No matching todos" : "Nothing to do yet"}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {search ? "Try a different search." : "Tap + to add your first todo."}
            </Text>
          </GlassCard>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: Spacing.half,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  // Near-opaque so input text stays readable whatever is behind it
  surfaceLight: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "rgba(255, 255, 255, 1)",
    boxShadow: "0px 6px 20px rgba(32, 138, 239, 0.12), 0px 1px 4px rgba(0, 0, 0, 0.05)",
  },
  surfaceDark: {
    backgroundColor: "rgba(28, 30, 34, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.4)",
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    height: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  plus: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: brandGradient,
    boxShadow: "0px 8px 20px rgba(32, 138, 239, 0.4)",
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    paddingLeft: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
  },
  composerInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 44,
    paddingVertical: 0,
  },
  addButton: {
    height: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: brandGradient,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.4,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 22,
    borderWidth: 1,
  },
  cardLight: {
    borderColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0px 8px 20px rgba(32, 138, 239, 0.12), 0px 2px 6px rgba(0, 0, 0, 0.05)",
  },
  cardDark: {
    borderColor: "rgba(255, 255, 255, 0.08)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.45)",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: Spacing.half,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardTextDone: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  cardMeta: {
    fontSize: 12,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  empty: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});
