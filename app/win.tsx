import { Colors, Gradients } from "@/constants/colors";
import { MAX_LEVELS, useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, ChevronRight, Home, RotateCcw } from "lucide-react-native";
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

export default function WinScreen() {
  const router = useRouter();
  const { level, time } = useLocalSearchParams<{
    level?: string;
    time?: string;
  }>();
  const { setCurrentLevel } = useGame();
  const {
    musicEnabled,
    soundEnabled,
    isLoading: isSettingsLoading,
  } = useSettings();

  const levelNum = parseInt(level || "1", 10);
  const timeMs = parseInt(time || "0", 10);
  const isLastLevel = levelNum >= MAX_LEVELS;

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const winSoundRef = useRef<Audio.Sound | null>(null);

  const stopAndUnloadWinSound = useCallback(async () => {
    const sound = winSoundRef.current;
    winSoundRef.current = null;

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
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, confettiAnim]);

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

    const playWinSound = async () => {
      if (isSettingsLoading || !musicEnabled || !soundEnabled) {
        await stopAndUnloadWinSound();
        return;
      }

      if (winSoundRef.current) {
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/audio/dropsphere-win.wav"),
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.8,
        },
      );

      if (cancelled) {
        await sound.unloadAsync();
        return;
      }

      winSoundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (winSoundRef.current === sound) {
            winSoundRef.current = null;
          }
          void sound.unloadAsync();
        }
      });
    };

    void playWinSound();

    return () => {
      cancelled = true;
    };
  }, [isSettingsLoading, musicEnabled, soundEnabled, stopAndUnloadWinSound]);

  useEffect(() => {
    return () => {
      void stopAndUnloadWinSound();
    };
  }, [stopAndUnloadWinSound]);

  const nextLevel = useCallback(() => {
    if (!isLastLevel) {
      const nextLevelNum = levelNum + 1;
      setCurrentLevel(nextLevelNum);
      router.replace({
        pathname: "/game",
        params: { level: nextLevelNum.toString() },
      });
    }
  }, [isLastLevel, levelNum, router, setCurrentLevel]);

  const replayLevel = useCallback(() => {
    router.replace({
      pathname: "/game",
      params: { level: levelNum.toString() },
    });
  }, [levelNum, router]);

  const goHome = useCallback(() => {
    router.replace("/home");
  }, [router]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Confetti Effect */}
        <Animated.View
          style={[
            styles.confetti,
            { opacity: confettiAnim, transform: [{ scale: confettiAnim }] },
          ]}
        >
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.confettiPiece,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: [
                    Colors.success,
                    Colors.primary,
                    Colors.secondary,
                    Colors.accent,
                  ][i % 4],
                  transform: [{ rotate: `${Math.random() * 360}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={Gradients.success}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Check size={60} color={Colors.text.primary} strokeWidth={4} />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Level Complete!</Text>

          {/* Level Info */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelNumber}>Level {levelNum}</Text>
            <Text style={styles.timeText}>Time: {formatTime(timeMs)}</Text>
          </View>

          {/* Progress */}
          {!isLastLevel && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Next: Level {levelNum + 1}
              </Text>
            </View>
          )}

          {isLastLevel && (
            <View style={styles.completedContainer}>
              <Text style={styles.completedTitle}>🎉 Congratulations! 🎉</Text>
              <Text style={styles.completedText}>
                You have completed all {MAX_LEVELS} levels!
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {!isLastLevel && (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={nextLevel}
              >
                <LinearGradient
                  colors={Gradients.success}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>Next Level</Text>
                  <ChevronRight size={24} color={Colors.text.primary} />
                </LinearGradient>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={replayLevel}
            >
              <RotateCcw size={20} color={Colors.text.primary} />
              <Text style={styles.buttonText}>Replay</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.tertiaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={goHome}
            >
              <Home size={20} color={Colors.text.secondary} />
              <Text style={styles.tertiaryButtonText}>Home</Text>
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
  confetti: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
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
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.text.primary,
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
    color: Colors.success,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  progressContainer: {
    backgroundColor: Colors.card.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  completedContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.success,
    marginBottom: 8,
    textAlign: "center",
  },
  completedText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
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
    shadowColor: Colors.success,
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
  tertiaryButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
});
