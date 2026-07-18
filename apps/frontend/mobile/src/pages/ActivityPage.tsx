import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { trackEvent } from "../events/track-event";

const events = [{ id: "welcome", title: "Welcome to EchoPrint", date: "Today" }];

export function ActivityPage({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.copy}>Your recordings and memories.</Text>
        {events.map((event) => (
          <Pressable key={event.id} style={styles.card} onPress={() => { trackEvent("event_opened", { eventId: event.id }); onOpen(event.id); }}>
            <Text>{event.title} · {event.date}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, gap: 12, padding: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  copy: { color: "#4b5563" },
  card: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 16 },
});
