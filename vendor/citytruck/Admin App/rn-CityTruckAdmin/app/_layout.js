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
      <Stack.Screen name="truckTrip/truckTripScreen" />
      <Stack.Screen name="createTrip/createTripScreen" />
      <Stack.Screen name="trackTruck/trackTruckScreen" />
      <Stack.Screen name="track/trackScreen" />
      <Stack.Screen name="trucks/trucksScreen" />
      <Stack.Screen name="truckInfo/truckInfoScreen" />
      <Stack.Screen name="addTruck/addTruckScreen" />
      <Stack.Screen name="drivers/driversScreen" />
      <Stack.Screen name="driverInfo/driverInfoScreen" />
      <Stack.Screen name="addHelpers/addHelpersScreen" />
      <Stack.Screen name="addDriver/addDriverScreen" />
      <Stack.Screen name="termsAndConditions/termsAndConditionsScreen" />
      <Stack.Screen name="contactUs/contactUsScreen" />
      <Stack.Screen name="logout/logoutScreen" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
