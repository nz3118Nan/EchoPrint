import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

type Props = { email?: string; onSignOut: () => void };

export function ProfilePage({ email, onSignOut }: Props) {
  const name = email?.split("@")[0] ?? "Trail keeper";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR TRAIL</Text>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.name}>{name}</Text>
              <View style={styles.privatePill}><Text style={styles.privateText}>PRIVATE</Text></View>
            </View>
            <Text numberOfLines={1} style={styles.email}>{email ?? "Signed in with Google"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Trail preferences</Text>
        <View style={styles.group}>
          <SettingRow icon="↗" label="Distance units" value="Metric" />
          <Divider />
          <SettingRow icon="◎" label="Memory visibility" value="Only me" />
          <Divider />
          <SettingRow icon="◌" label="Notifications" value="Quiet" />
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.group}>
          <SettingRow icon="✦" label="EchoPoint" value="Prototype · 0.1" />
        </View>
        <Text style={styles.build}>DEVELOPMENT BUILD · ECHOPOINT 0.1.0 · 312</Text>

        <Pressable accessibilityRole="button" style={styles.signOutButton} onPress={() => Alert.alert("Sign out?", "Your saved session will be removed from this device.", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign out", style: "destructive", onPress: onSignOut },
        ])}>
          <Text style={styles.signOutText}>Sign out</Text>
          <Text style={styles.signOutArrow}>→</Text>
        </Pressable>
        <Text style={styles.footer}>Your trail stays private unless you choose to share it.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <View style={styles.row}>
    <View style={styles.rowIcon}><Text style={styles.rowIconText}>{icon}</Text></View>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>;
}

function Divider() { return <View style={styles.divider} />; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#12382D" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 116 },
  eyebrow: { color: "#B8D49D", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#F7F4EC", fontSize: 36, fontWeight: "700", letterSpacing: -1, marginTop: 7 },
  profileCard: { alignItems: "center", backgroundColor: "#1D4A3C", borderColor: "#356654", borderRadius: 22, borderWidth: 1, flexDirection: "row", marginTop: 23, padding: 18 },
  avatar: { alignItems: "center", backgroundColor: "#D7E5B7", borderRadius: 25, height: 50, justifyContent: "center", width: 50 },
  avatarText: { color: "#12382D", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  identity: { flex: 1, marginLeft: 13 },
  nameRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  name: { color: "#F7F4EC", fontSize: 16, fontWeight: "700", textTransform: "capitalize" },
  email: { color: "#BED2C0", fontSize: 12, marginTop: 4 },
  privatePill: { backgroundColor: "#285646", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6 },
  privateText: { color: "#C9E0B7", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  sectionTitle: { color: "#B8D49D", fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 9, marginTop: 26, textTransform: "uppercase" },
  group: { backgroundColor: "#F6F4ED", borderRadius: 18, paddingHorizontal: 15 },
  row: { alignItems: "center", flexDirection: "row", minHeight: 58 },
  rowIcon: { alignItems: "center", backgroundColor: "#E6EEE0", borderRadius: 11, height: 28, justifyContent: "center", width: 28 },
  rowIconText: { color: "#24513F", fontSize: 15, fontWeight: "700" },
  rowLabel: { color: "#173A2F", flex: 1, fontSize: 14, fontWeight: "600", marginLeft: 11 },
  rowValue: { color: "#718078", fontSize: 12, fontWeight: "600" },
  divider: { backgroundColor: "#E0E5DB", height: StyleSheet.hairlineWidth, marginLeft: 39 },
  build: { color: "#82A78E", fontSize: 10, fontWeight: "700", letterSpacing: 0.7, marginTop: 12, textAlign: "center" },
  signOutButton: { alignItems: "center", borderColor: "#648D77", borderRadius: 16, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 27, paddingHorizontal: 18, paddingVertical: 17 },
  signOutText: { color: "#F3C5B9", fontSize: 15, fontWeight: "700" },
  signOutArrow: { color: "#F3C5B9", fontSize: 19, fontWeight: "500" },
  footer: { color: "#A7C0AD", fontSize: 11, lineHeight: 16, marginTop: 14, textAlign: "center" },
});
