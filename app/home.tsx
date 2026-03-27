import DropSphereLogo from "@/components/DropSphereLogo";
import { Colors, Gradients } from "@/constants/colors";
import { MAX_LEVELS, useGame } from "@/context/GameContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Play, Settings, Trophy, User } from "lucide-react-native";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width: _width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const {
    currentLevel,
    completedLevels,
    totalWins,
    totalAttempts,
    isLoading,
    isAuthenticated,
    setCurrentLevel,
  } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const startGame = useCallback(() => {
    setCurrentLevel(1);
    router.push({
      pathname: "/game",
      params: { level: "1" },
    });
  }, [router, setCurrentLevel]);

  const resumeGame = useCallback(() => {
    router.push({
      pathname: "/game",
      params: { level: currentLevel.toString() },
    });
  }, [currentLevel, router]);

  const selectLevel = useCallback(() => {
    router.push("/levels");
  }, [router]);

  const openSettings = useCallback(() => {
    router.push("/settings");
  }, [router]);

  const progressPercent = (currentLevel / MAX_LEVELS) * 100;

  if (isLoading) {
    return (
      <LinearGradient
        colors={Gradients.background}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.iconButton}
              onPress={() => router.push("/profile")}
            >
              <User size={24} color={Colors.text.primary} />
            </Pressable>
            <View style={styles.titleContainer}>
              <DropSphereLogo width={180} />
            </View>
            <Pressable style={styles.iconButton} onPress={openSettings}>
              <Settings size={24} color={Colors.text.primary} />
            </Pressable>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <LinearGradient
              colors={["rgba(108, 92, 231, 0.2)", "rgba(0, 210, 255, 0.1)"]}
              style={styles.progressGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.progressHeader}>
                <Trophy size={20} color={Colors.success} />
                <Text style={styles.progressLabel}>Your Progress</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.currentLevel}>{currentLevel}</Text>
                <Text style={styles.levelTotal}>/ {MAX_LEVELS}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%` },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.progressText}>
                {completedLevels.length} levels completed
              </Text>
            </LinearGradient>
          </View>

          {/* Main Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.mainButton,
                styles.playButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={startGame}
            >
              <LinearGradient
                colors={Gradients.primary}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Play size={28} color={Colors.text.primary} fill="white" />
                <Text style={styles.mainButtonText}>Start Game</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={resumeGame}
            >
              <Text style={styles.secondaryButtonText}>
                Resume Level {currentLevel}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={selectLevel}
            >
              <Text style={styles.secondaryButtonText}>Select Level</Text>
            </Pressable>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalWins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalAttempts}</Text>
              <Text style={styles.statLabel}>Attempts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {totalAttempts > 0
                  ? Math.round((totalWins / totalAttempts) * 100)
                  : 0}
                %
              </Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.text.primary,
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  progressCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  progressGradient: {
    padding: 24,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  levelInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  currentLevel: {
    fontSize: 56,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  levelTotal: {
    fontSize: 20,
    color: Colors.text.muted,
    fontWeight: "500",
    marginLeft: 4,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  mainButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  playButton: {
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  secondaryButton: {
    borderRadius: 20,
    backgroundColor: Colors.card.background,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.card.background,
    borderRadius: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.card.border,
  },
});
