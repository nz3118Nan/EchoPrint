import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function LoginPage({ busy, error, onGoogleSignIn }: {
  busy: boolean;
  error?: string;
  onGoogleSignIn: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
          <Text style={styles.brand}>ECHOPOINT</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>OUTDOOR MEMORY JOURNAL</Text>
          <Text style={styles.title}>Leave a trail{`\n`}of every feeling.</Text>
          <Text style={styles.copy}>Follow your route. Capture the moment. Return to it whenever you need.</Text>
          <View style={styles.pills}>
            <Text style={styles.pill}>TRACK</Text>
            <Text style={styles.pill}>CAPTURE</Text>
            <Text style={styles.pill}>REFLECT</Text>
          </View>
        </View>

        <View style={styles.terrain}>
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
          <View style={styles.route}><View style={styles.routeDot} /></View>
        </View>

        <View style={styles.signInArea}>
          <Pressable accessibilityRole="button" disabled={busy} style={[styles.button, busy && styles.disabled]} onPress={onGoogleSignIn}>
            <View style={styles.googleMark}><Text style={styles.googleMarkText}>G</Text></View>
            <Text style={styles.buttonText}>{busy ? "Connecting to Google…" : "Continue with Google"}</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.terms}>By continuing, you agree to create a private trail of your moments.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#12382D", overflow: "hidden" },
  content: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24, paddingBottom: 28 },
  auroraOne: { position: "absolute", top: -130, right: -110, width: 310, height: 310, borderRadius: 200, backgroundColor: "#245C48", opacity: 0.72 },
  auroraTwo: { position: "absolute", top: 250, left: -160, width: 300, height: 300, borderRadius: 200, backgroundColor: "#1B4A3A", opacity: 0.8 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 12 },
  brandMark: { width: 25, height: 25, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1.5, borderColor: "#D3E5BA" },
  brandMarkInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#D3E5BA" },
  brand: { color: "#F4F0E6", fontSize: 12, fontWeight: "800", letterSpacing: 2.3 },
  hero: { marginTop: 34 },
  eyebrow: { color: "#C5D6A4", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#F7F4EC", fontSize: 42, fontWeight: "700", letterSpacing: -1.5, lineHeight: 46, marginTop: 15 },
  copy: { color: "#D8E3D7", fontSize: 16, lineHeight: 24, marginTop: 17, maxWidth: 315 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24 },
  pill: { borderColor: "#88AD88", borderRadius: 20, borderWidth: 1, color: "#DDEAD3", fontSize: 10, fontWeight: "800", letterSpacing: 1, overflow: "hidden", paddingHorizontal: 11, paddingVertical: 7 },
  terrain: { height: 165, marginHorizontal: -24, overflow: "hidden", position: "relative" },
  hillBack: { position: "absolute", bottom: -75, left: -20, width: 260, height: 220, backgroundColor: "#204E3E", borderRadius: 150, transform: [{ rotate: "-16deg" }] },
  hillFront: { position: "absolute", bottom: -95, right: -70, width: 330, height: 250, backgroundColor: "#0C2B22", borderRadius: 180, transform: [{ rotate: "13deg" }] },
  route: { position: "absolute", right: 88, bottom: 38, width: 2, height: 90, backgroundColor: "#B8D49D", opacity: 0.9, transform: [{ rotate: "-26deg" }] },
  routeDot: { position: "absolute", top: -3, left: -5, width: 12, height: 12, backgroundColor: "#E4F2BB", borderColor: "#12382D", borderRadius: 6, borderWidth: 2 },
  signInArea: { gap: 14 },
  button: { alignItems: "center", backgroundColor: "#F6F4ED", borderRadius: 16, flexDirection: "row", justifyContent: "center", minHeight: 58, paddingHorizontal: 18 },
  disabled: { opacity: 0.6 },
  googleMark: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, height: 28, justifyContent: "center", marginRight: 11, width: 28 },
  googleMarkText: { color: "#4285F4", fontSize: 16, fontWeight: "800" },
  buttonText: { color: "#173A2F", fontSize: 16, fontWeight: "700" },
  error: { color: "#FFD2C8", fontSize: 13, lineHeight: 18, textAlign: "center" },
  terms: { color: "#AFC4B1", fontSize: 11, lineHeight: 16, paddingHorizontal: 20, textAlign: "center" },
});
