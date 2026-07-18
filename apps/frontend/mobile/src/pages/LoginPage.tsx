import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function LoginPage({ busy, error, onSignIn }: { busy: boolean; error?: string; onSignIn: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>EchoPrint</Text>
        <Text style={styles.copy}>Sign in to save your voice notes and memories.</Text>
        <Pressable disabled={busy} style={[styles.button, busy && styles.disabled]} onPress={onSignIn}>
          <Text style={styles.buttonText}>{busy ? "Signing in…" : "Continue with Google"}</Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 },
  title: { fontSize: 32, fontWeight: "700" },
  copy: { color: "#4b5563", textAlign: "center" },
  button: { backgroundColor: "#111827", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 },
  disabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#b91c1c", textAlign: "center" },
});
