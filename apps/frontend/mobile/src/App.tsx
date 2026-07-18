import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { signInWithGoogle, syncUser } from "./auth/google";
import { supabase } from "./auth/supabase";
import { MainNavigation, type MainPage } from "./navigation/MainNavigation";
import { ActivityPage } from "./pages/ActivityPage";
import { EventPage } from "./pages/EventPage";
import { LoginPage } from "./pages/LoginPage";
import { NavigatePage } from "./pages/NavigatePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";

type Page = MainPage | "event";
const onboardingKey = (userId: string) => `echoprint:onboarded:${userId}`;

export default function App() {
  const [page, setPage] = useState<Page>("activity");
  const [eventId, setEventId] = useState<string>();
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [onboarded, setOnboarded] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      await syncUser(data.session.access_token);
      setEmail(data.session.user.email);
      setUserId(data.session.user.id);
      setOnboarded((await AsyncStorage.getItem(onboardingKey(data.session.user.id))) === "true");
      setSignedIn(true);
    }).catch(() => setError("Your saved session could not be synced.")).finally(() => setCheckingSession(false));
  }, []);

  async function login() {
    setBusy(true);
    setError(undefined);
    try {
      const session = await signInWithGoogle();
      if (!session) return;
      await syncUser(session.access_token);
      setEmail(session.user.email);
      setUserId(session.user.id);
      setOnboarded((await AsyncStorage.getItem(onboardingKey(session.user.id))) === "true");
      setSignedIn(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function completeOnboarding() {
    if (userId) await AsyncStorage.setItem(onboardingKey(userId), "true");
    setOnboarded(true);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSignedIn(false);
    setOnboarded(false);
    setUserId(undefined);
  }

  if (checkingSession) return null;
  if (!signedIn) return <LoginPage busy={busy} error={error} onGoogleSignIn={login} />;
  if (!onboarded) return <OnboardingPage onComplete={completeOnboarding} />;
  if (page === "event" && eventId) return <EventPage id={eventId} onBack={() => setPage("activity")} />;
  let content;
  if (page === "navigate") content = <NavigatePage />;
  else if (page === "profile") content = <ProfilePage email={email} onSignOut={signOut} />;
  else content = <ActivityPage onOpen={(id) => { setEventId(id); setPage("event"); }} />;

  const mainPage: MainPage = page === "event" ? "activity" : page;
  return <View style={styles.app}>{content}<MainNavigation page={mainPage} onChange={setPage} /></View>;
}

const styles = StyleSheet.create({
  app: { flex: 1, position: "relative" },
});
