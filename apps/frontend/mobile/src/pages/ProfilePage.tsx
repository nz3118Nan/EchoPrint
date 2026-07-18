import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export function ProfilePage({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text>{email ?? "Signed in"}</Text>
        <Pressable onPress={onSignOut}><Text style={styles.link}>Sign out</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, gap: 16, padding: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  link: { color: "#b91c1c", fontWeight: "600" },
});
