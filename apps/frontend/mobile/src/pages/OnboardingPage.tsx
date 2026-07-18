import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>WELCOME TO ECHOPRINT</Text>
        <Text style={styles.title}>Keep the moments you want to return to.</Text>
        <Text style={styles.copy}>Capture a thought, attach a place, and find it again when it matters.</Text>
        <Pressable style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: "center", gap: 18, padding: 28 },
  eyebrow: { color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 1.2 },
  title: { fontSize: 34, fontWeight: "700", lineHeight: 40 },
  copy: { color: "#4b5563", fontSize: 17, lineHeight: 24 },
  button: { alignSelf: "flex-start", backgroundColor: "#111827", borderRadius: 12, marginTop: 10, paddingHorizontal: 20, paddingVertical: 14 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
