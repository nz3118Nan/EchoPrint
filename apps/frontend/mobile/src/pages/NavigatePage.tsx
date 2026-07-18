import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export function NavigatePage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Navigate</Text>
        <Text style={styles.copy}>Find a memory, place, or moment.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, gap: 12, padding: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  copy: { color: "#4b5563" },
});
