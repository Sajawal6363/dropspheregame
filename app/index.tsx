import DropSphereLogo from "@/components/DropSphereLogo";
import { Colors, Gradients } from "@/constants/colors";
import { useGame } from "@/context/GameContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useGame();
  const ballY = useRef(new Animated.Value(-100)).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballGlow = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const entranceAnimation = Animated.sequence([
      Animated.timing(ballY, {
        toValue: height * 0.35,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(ballScale, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(ballGlow, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    const navigateTimer = setTimeout(() => {
      router.replace(isAuthenticated ? "/home" : "/welcome");
    }, 3000);

    return () => clearTimeout(navigateTimer);
  }, [
    ballY,
    ballScale,
    ballGlow,
    textOpacity,
    taglineOpacity,
    isAuthenticated,
    isLoading,
    router,
  ]);

  const ballTransform = [{ translateY: ballY }, { scale: ballScale }];

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.ballContainer,
              {
                transform: ballTransform,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.ballGlow,
                {
                  opacity: ballGlow,
                  transform: [{ scale: Animated.add(1, ballGlow) }],
                },
              ]}
            />
            <LinearGradient
              colors={Gradients.ball}
              style={styles.ball}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.ballShine} />
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={[styles.textContainer, { opacity: textOpacity }]}
          >
            <DropSphereLogo width={270} />
            <Animated.Text
              style={[styles.tagline, { opacity: taglineOpacity }]}
            >
              Fall into the rhythm
            </Animated.Text>
          </Animated.View>

          <Pressable
            style={styles.skipButton}
            onPress={() =>
              router.replace(isAuthenticated ? "/home" : "/welcome")
            }
          >
            <Text style={styles.skipText}>Tap to skip</Text>
          </Pressable>
        </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ballContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ballGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.glow.purple,
  },
  ball: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  ballShine: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 10,
    marginLeft: 10,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  tagline: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  skipButton: {
    position: "absolute",
    bottom: 50,
  },
  skipText: {
    fontSize: 14,
    color: Colors.text.muted,
    letterSpacing: 1,
  },
});
