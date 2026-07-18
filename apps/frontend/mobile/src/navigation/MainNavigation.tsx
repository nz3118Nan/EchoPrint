import { Pressable, StyleSheet, Text, View } from "react-native";

export type MainPage = "activity" | "navigate" | "profile";

const labels: Record<MainPage, string> = {
  activity: "Activity",
  navigate: "Navigate",
  profile: "Profile",
};

export function MainNavigation({ page, onChange }: { page: MainPage; onChange: (page: MainPage) => void }) {
  return (
    <View style={styles.nav}>
      {(Object.keys(labels) as MainPage[]).map((item) => (
        <Pressable key={item} onPress={() => onChange(item)}>
          <Text style={[styles.label, item === page && styles.active]}>{labels[item]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderColor: "#e5e7eb", padding: 14 },
  label: { color: "#6b7280", fontSize: 12 },
  active: { color: "#111827", fontWeight: "700" },
});
