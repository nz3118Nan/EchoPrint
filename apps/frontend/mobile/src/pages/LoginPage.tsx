import { StatusBar } from "expo-status-bar";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>OUTDOOR MEMORY JOURNAL</Text>
          <Text style={styles.title}>Leave a trail</Text>
          <View style={styles.titleLine}>
            <Text style={[styles.title, styles.titleInline]}>of</Text>
            <View style={styles.titleMark}>
              <Image source={require("../../assets/brand/login-mark.png")} style={styles.titleLogo} />
            </View>
            <Text style={[styles.title, styles.titleInline]}>very feeling.</Text>
          </View>
        </View>
        <View style={styles.terrain}>
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
          <View style={styles.route}><View style={styles.routeDot} /></View>
        </View>
        <View style={styles.signInArea}>
          <Pressable accessibilityRole="button" disabled={busy} onPress={onGoogleSignIn} style={[styles.button, busy && styles.disabled]}>
            <View style={styles.googleMark}><Image source={require("../../assets/brand/google-g.png")} style={styles.googleLogo} /></View>
            <Text style={styles.buttonText}>{busy ? "Connecting to Google…" : "Continue with Google"}</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text numberOfLines={1} style={styles.terms}>We may collect your location while you hike.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#0C2B22", flex: 1, overflow: "hidden" },
  content: { flex: 1, justifyContent: "space-between", paddingBottom: 28, paddingHorizontal: 24 },
  auroraOne: { backgroundColor: "#245C48", borderRadius: 200, height: 310, opacity: 0.72, position: "absolute", right: -110, top: -130, width: 310 },
  auroraTwo: { backgroundColor: "#1B4A3A", borderRadius: 200, height: 300, left: -160, opacity: 0.8, position: "absolute", top: 250, width: 300 },
  hero: { marginTop: 62 },
  eyebrow: { color: "#C5D6A4", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#F7F4EC", fontSize: 42, fontWeight: "700", letterSpacing: -1.5, lineHeight: 46, marginTop: 15 },
  titleInline: { marginTop: 0 },
  titleLine: { alignItems: "center", flexDirection: "row", gap: 0 },
  titleMark: { height: 35, marginLeft: 7, marginRight: -3, position: "relative", transform: [{ translateY: 1 }], width: 35 },
  titleLogo: { height: 35, width: 35 },
  terrain: { bottom: -220, height: 610, left: -24, overflow: "hidden", position: "absolute", right: -24 },
  hillBack: { backgroundColor: "#204E3E", borderRadius: 220, bottom: 50, height: 400, left: -45, position: "absolute", transform: [{ rotate: "-16deg" }], width: 360 },
  hillFront: { backgroundColor: "#0C2B22", borderRadius: 240, bottom: 35, height: 440, position: "absolute", right: -100, transform: [{ rotate: "13deg" }], width: 440 },
  route: { backgroundColor: "#B8D49D", bottom: 356, height: 110, opacity: 0.9, position: "absolute", right: 88, transform: [{ rotate: "-26deg" }], width: 2 },
  routeDot: { backgroundColor: "#E4F2BB", borderColor: "#12382D", borderRadius: 6, borderWidth: 2, height: 12, left: -5, position: "absolute", top: -3, width: 12 },
  signInArea: { gap: 14 },
  button: { alignItems: "center", backgroundColor: "#F6F4ED", borderRadius: 16, flexDirection: "row", justifyContent: "center", minHeight: 58, paddingHorizontal: 18 },
  disabled: { opacity: 0.6 },
  googleMark: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 14, height: 28, justifyContent: "center", marginRight: 11, width: 28 },
  googleLogo: { height: 18, width: 18 },
  buttonText: { color: "#173A2F", fontSize: 16, fontWeight: "700" },
  error: { color: "#FFD2C8", fontSize: 13, lineHeight: 18, textAlign: "center" },
  terms: { color: "#AFC4B1", fontSize: 11, lineHeight: 16, paddingHorizontal: 20, textAlign: "center" },
});
