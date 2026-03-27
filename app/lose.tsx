import { Colors, Gradients } from "@/constants/colors";
import { useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, RotateCcw, X } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LoseScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const { setCurrentLevel } = useGame();
  const {
    musicEnabled,
    soundEnabled,
    isLoading: isSettingsLoading,
  } = useSettings();

  const levelNum = parseInt(level || "1", 10);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loseSoundRef = useRef<Audio.Sound | null>(null);

  const stopAndUnloadLoseSound = useCallback(async () => {
    const sound = loseSoundRef.current;
    loseSoundRef.current = null;

    if (!sound) {
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.stopAsync();
      }
      await sound.unloadAsync();
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    // Shake animation for game over effect
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [shakeAnim, opacityAnim, scaleAnim]);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const playLoseSound = async () => {
      if (isSettingsLoading || !musicEnabled || !soundEnabled) {
        await stopAndUnloadLoseSound();
        return;
      }

      if (loseSoundRef.current) {
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/audio/dropsphere-lose.wav"),
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.75,
        },
      );

      if (cancelled) {
        await sound.unloadAsync();
        return;
      }

      loseSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (loseSoundRef.current === sound) {
            loseSoundRef.current = null;
          }
          void sound.unloadAsync();
        }
      });
    };

    void playLoseSound();

    return () => {
      cancelled = true;
    };
  }, [isSettingsLoading, musicEnabled, soundEnabled, stopAndUnloadLoseSound]);

  useEffect(() => {
    return () => {
      void stopAndUnloadLoseSound();
    };
  }, [stopAndUnloadLoseSound]);

  const retryLevel = useCallback(() => {
    setCurrentLevel(levelNum);
    router.replace({
      pathname: "/game",
      params: { level: levelNum.toString() },
    });
  }, [levelNum, router, setCurrentLevel]);

  const goHome = useCallback(() => {
    router.replace("/home");
  }, [router]);

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
            },
          ]}
        >
          {/* Failure Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={Gradients.danger}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <X size={60} color={Colors.text.primary} strokeWidth={4} />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Game Over</Text>

          {/* Message */}
          <Text style={styles.message}>The ball fell off the platforms!</Text>

          {/* Level Info */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelNumber}>Level {levelNum}</Text>
            <Text style={styles.levelHint}>Try again to master this level</Text>
          </View>

          {/* Tip */}
          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            <Text style={styles.tipText}>
              Swipe gently to control the ball. Watch the platform movements and
              time your landings carefully.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={retryLevel}
            >
              <LinearGradient
                colors={Gradients.danger}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <RotateCcw size={24} color={Colors.text.primary} />
                <Text style={styles.buttonText}>Try Again</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={goHome}
            >
              <Home size={20} color={Colors.text.primary} />
              <Text style={styles.buttonText}>Back to Home</Text>
            </Pressable>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    width: width - 48,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.danger,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: "center",
  },
  levelInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  levelHint: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  tipContainer: {
    backgroundColor: Colors.card.background,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
    width: "100%",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.success,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  primaryButton: {
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.card.background,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
