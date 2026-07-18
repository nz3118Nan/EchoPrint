import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, LogBox, StatusBar } from 'react-native';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    Montserrat_Regular: require("../assets/fonts/montserrat/Montserrat-Regular.ttf"),
    Montserrat_Medium: require("../assets/fonts/montserrat/Montserrat-Medium.ttf"),
    Montserrat_SemiBold: require("../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
    Montserrat_Bold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    Montserrat_BoldItalic: require("../assets/fonts/montserrat/Montserrat-BoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const subscription = AppState.addEventListener("change", (_) => {
      StatusBar.setBarStyle("light-content");
    });
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
      <Stack.Screen name="auth/signinScreen" />
      <Stack.Screen name="auth/signupScreen" />
      <Stack.Screen name="auth/verificationScreen" />
      <Stack.Screen name="drawer" options={{ gestureEnabled: false }} />
      <Stack.Screen name="truckInfo/truckInfoScreen" />
      <Stack.Screen name="tripInfo/tripInfoScreen" />
      <Stack.Screen name="upcomingTasks/upcomingTasksScreen" />
      <Stack.Screen name="tasks/tasksScreen" />
      <Stack.Screen name="tripHistory/tripHistoryScreen" />
      <Stack.Screen name="setting/settingScreen" />
      <Stack.Screen name="profile/profileScreen" />
      <Stack.Screen name="logout/logoutScreen" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
