import AppBackgroundTransition from "@/components/AppBackgroundTransition";
import { GameContext } from "@/context/GameContext";
import { SettingsContext } from "@/context/SettingsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="levels" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen
        name="win"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="lose"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/forgot-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="info/privacy" options={{ headerShown: false }} />
      <Stack.Screen name="info/terms" options={{ headerShown: false }} />
      <Stack.Screen name="info/faq" options={{ headerShown: false }} />
      <Stack.Screen name="info/contact" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GameContext>
        <SettingsContext>
          <GestureHandlerRootView style={styles.root}>
            <View style={styles.root}>
              <RootLayoutNav />
              <AppBackgroundTransition pathname={pathname} />
            </View>
          </GestureHandlerRootView>
        </SettingsContext>
      </GameContext>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
  },
});
