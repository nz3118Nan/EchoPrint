import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { signInWithEmail, signUpWithEmail } from "./auth/email";
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
  const [notice, setNotice] = useState<string>();
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
    setNotice(undefined);
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

  async function loginWithEmail(email: string, password: string) {
    setBusy(true);
    setError(undefined);
    setNotice(undefined);
    try {
      const session = await signInWithEmail(email, password);
      if (!session) throw new Error("Email sign-in did not return a session.");
      await syncUser(session.access_token);
      setEmail(session.user.email);
      setUserId(session.user.id);
      setOnboarded((await AsyncStorage.getItem(onboardingKey(session.user.id))) === "true");
      setSignedIn(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Email sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function createAccountWithEmail(email: string, password: string) {
    setBusy(true);
    setError(undefined);
    setNotice(undefined);
    try {
      const session = await signUpWithEmail(email, password);
      if (!session) {
        setNotice("Check your email to confirm your account, then sign in here.");
        return;
      }
      await syncUser(session.access_token);
      setEmail(session.user.email);
      setUserId(session.user.id);
      setOnboarded(false);
      setSignedIn(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create your account.");
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
  if (!signedIn) return <LoginPage busy={busy} error={error} notice={notice} onGoogleSignIn={login} onEmailSignIn={loginWithEmail} onEmailSignUp={createAccountWithEmail} />;
  if (!onboarded) return <OnboardingPage onComplete={completeOnboarding} />;
  if (page === "event" && eventId) return <EventPage id={eventId} onBack={() => setPage("activity")} />;
  let content;
  if (page === "navigate") content = <NavigatePage />;
  else if (page === "profile") content = <ProfilePage email={email} onSignOut={signOut} />;
  else content = <ActivityPage onOpen={(id) => { setEventId(id); setPage("event"); }} />;

  const mainPage: MainPage = page === "event" ? "activity" : page;
  return <>{content}<MainNavigation page={mainPage} onChange={setPage} /></>;
}
