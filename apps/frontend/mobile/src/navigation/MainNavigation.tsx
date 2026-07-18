import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type MainPage = "activity" | "navigate" | "profile";

const items: { id: MainPage; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "activity", label: "Activity", icon: "activity" },
  { id: "navigate", label: "Navigate", icon: "compass" },
  { id: "profile", label: "Profile", icon: "user" },
];

export function MainNavigation({ page, onChange }: { page: MainPage; onChange: (page: MainPage) => void }) {
  return <View style={styles.nav}>
    <BlurView intensity={48} style={StyleSheet.absoluteFill} tint="dark" />
    {items.map((item) => {
      const active = item.id === page;
      const color = active ? "#F0F4E5" : "#BED0C1";
      return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={item.id} onPress={() => onChange(item.id)} style={styles.item}>
        <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
          <Feather color={color} name={item.icon} size={18} strokeWidth={active ? 2.6 : 2} />
        </View>
        <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
      </Pressable>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    backgroundColor: "rgba(18, 56, 45, 0.58)",
    borderColor: "rgba(221, 239, 207, 0.52)",
    borderRadius: 30,
    borderWidth: 1,
    bottom: 12,
    elevation: 10,
    flexDirection: "row",
    height: 76,
    justifyContent: "space-around",
    left: 14,
    overflow: "hidden",
    paddingHorizontal: 12,
    position: "absolute",
    right: 14,
    shadowColor: "#173F32",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.16,
    shadowRadius: 15,
  },
  item: { alignItems: "center", flex: 1, gap: 4, justifyContent: "center" },
  iconWrap: { alignItems: "center", borderRadius: 17, height: 33, justifyContent: "center", width: 48 },
  activeIconWrap: { backgroundColor: "rgba(23, 63, 50, 0.92)", borderColor: "rgba(232, 246, 212, 0.7)", borderWidth: StyleSheet.hairlineWidth },
  label: { color: "#BED0C1", fontSize: 11, fontWeight: "700" },
  activeLabel: { color: "#F0F4E5" },
});
