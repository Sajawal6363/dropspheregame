import DropSphereLogo from "@/components/DropSphereLogo";
import { Colors, Gradients } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeGateScreen() {
  const router = useRouter();

  const spin = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(drift, {
            toValue: 1,
            duration: 2600,
            useNativeDriver: true,
          }),
          Animated.timing(drift, {
            toValue: 0,
            duration: 2600,
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.timing(reveal, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [drift, reveal, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateReverse = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const glowShift = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-12, 12],
  });

  const rise = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <LinearGradient
      colors={[
        "rgba(15, 32, 39, 0.95)",
        "rgba(32, 58, 67, 0.92)",
        "rgba(44, 83, 100, 0.95)",
      ]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundLayer} pointerEvents="none">
          <Animated.View
            style={[
              styles.backGlow,
              styles.backGlowOne,
              {
                transform: [{ translateX: glowShift }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.backGlow,
              styles.backGlowTwo,
              {
                transform: [{ translateX: Animated.multiply(glowShift, -1) }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.backRing,
              styles.backRingLarge,
              {
                transform: [
                  { perspective: 900 },
                  { rotateZ: rotate },
                  { rotateX: "68deg" },
                ],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.backRing,
              styles.backRingMedium,
              {
                transform: [
                  { perspective: 900 },
                  { rotateZ: rotateReverse },
                  { rotateY: "18deg" },
                ],
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: reveal,
              transform: [{ translateY: rise }],
            },
          ]}
        >
          <View style={styles.heroTop}>
            <DropSphereLogo width={200} style={styles.heroLogo} />
            <Text style={styles.title}>Play starts after Login</Text>
            <Text style={styles.subtitle}>
              Create your account or sign in to start levels, save progress, and
              continue your journey.
            </Text>
          </View>

          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/auth/login")}
            >
              <LinearGradient
                colors={Gradients.primary}
                style={styles.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryText}>Login</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/auth/signup")}
            >
              <Text style={styles.secondaryText}>Create New Account</Text>
            </Pressable>

            <Text style={styles.helperText}>
              You need an account to play and unlock levels.
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backGlow: {
    position: "absolute",
    borderRadius: 999,
  },
  backGlowOne: {
    top: 24,
    width: 280,
    height: 280,
    backgroundColor: "rgba(108, 92, 231, 0.24)",
  },
  backGlowTwo: {
    top: 120,
    width: 220,
    height: 220,
    backgroundColor: "rgba(0, 210, 255, 0.2)",
  },
  backRing: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
    opacity: 0.33,
  },
  backRingLarge: {
    top: 12,
    width: 320,
    height: 320,
    borderColor: "rgba(255,255,255,0.36)",
  },
  backRingMedium: {
    top: 56,
    width: 250,
    height: 250,
    borderColor: "rgba(255,60,172,0.38)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 190,
    paddingBottom: 36,
  },
  heroTop: {
    gap: 12,
  },
  heroLogo: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "95%",
  },
  card: {
    backgroundColor: "rgba(10, 18, 26, 0.42)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 10,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  primaryGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: Colors.text.primary,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: Colors.text.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  helperText: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
