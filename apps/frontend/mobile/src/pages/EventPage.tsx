import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function EventPage({ id, onBack }: { id: string; onBack: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Event</Text>
        <Text>Event ID: {id}</Text>
        <Pressable onPress={onBack}><Text style={styles.link}>Back to events</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, gap: 12, padding: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  link: { color: "#2563eb", fontWeight: "600" },
});
