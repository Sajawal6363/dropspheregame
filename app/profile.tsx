import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Trophy,
  Target,
  Flame,
  Gamepad2,
  TrendingUp,
  Award,
  Users,
} from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";
import {
  useGame,
  MAX_LEVELS,
  getLevelDifficulty,
  getDifficultyColor,
} from "@/context/GameContext";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { user, totalWins, totalAttempts, getCompletedCount, completedLevels } =
    useGame();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const openLeaderboard = useCallback(() => {
    router.push("/leaderboard");
  }, [router]);

  const totalLosses = totalAttempts - totalWins;
  const winRate =
    totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : 0;
  const completedCount = getCompletedCount();

  const getDifficultyStats = () => {
    const stats = { easy: 0, medium: 0, hard: 0, "very-hard": 0, extreme: 0 };
    completedLevels.forEach((levelId: number) => {
      const diff = getLevelDifficulty(levelId);
      stats[diff]++;
    });
    return stats;
  };

  const difficultyStats = getDifficultyStats();

  const getRank = () => {
    if (completedCount >= 45) return { name: "Legend", color: "#FFD700" };
    if (completedCount >= 35) return { name: "Master", color: "#FF6B6B" };
    if (completedCount >= 25) return { name: "Expert", color: "#00D2FF" };
    if (completedCount >= 15) return { name: "Advanced", color: "#9B59B6" };
    if (completedCount >= 5) return { name: "Intermediate", color: "#3498DB" };
    return { name: "Beginner", color: "#95A5A6" };
  };

  const rank = getRank();

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
            <Pressable style={styles.backButton} onPress={goBack}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>Profile</Text>
            <Pressable style={styles.backButton} onPress={openLeaderboard}>
              <Users size={24} color={Colors.text.primary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <LinearGradient
                colors={["rgba(108, 92, 231, 0.3)", "rgba(0, 210, 255, 0.15)"]}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  </View>
                  <View
                    style={[styles.rankBadge, { backgroundColor: rank.color }]}
                  >
                    <Text style={styles.rankText}>{rank.name}</Text>
                  </View>
                </View>

                <Text style={styles.userName}>{user?.name || "Player"}</Text>
                <Text style={styles.userEmail}>
                  {user?.email || "player@example.com"}
                </Text>

                <View style={styles.progressSection}>
                  <View style={styles.levelProgress}>
                    <Text style={styles.levelNumber}>{completedCount}</Text>
                    <Text style={styles.levelTotal}>/{MAX_LEVELS}</Text>
                  </View>
                  <Text style={styles.progressLabel}>Levels Completed</Text>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${(completedCount / MAX_LEVELS) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Main Stats Grid */}
            <Text style={styles.sectionTitle}>Game Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: "rgba(0, 255, 171, 0.15)" },
                  ]}
                >
                  <Trophy size={24} color={Colors.success} />
                </View>
                <Text style={styles.statValue}>{totalWins}</Text>
                <Text style={styles.statLabel}>Total Wins</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: "rgba(255, 77, 77, 0.15)" },
                  ]}
                >
                  <Target size={24} color={Colors.danger} />
                </View>
                <Text style={styles.statValue}>{totalLosses}</Text>
                <Text style={styles.statLabel}>Losses</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: "rgba(255, 60, 172, 0.15)" },
                  ]}
                >
                  <Gamepad2 size={24} color={Colors.accent} />
                </View>
                <Text style={styles.statValue}>{totalAttempts}</Text>
                <Text style={styles.statLabel}>Total Games</Text>
              </View>

              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: "rgba(0, 210, 255, 0.15)" },
                  ]}
                >
                  <TrendingUp size={24} color={Colors.secondary} />
                </View>
                <Text style={styles.statValue}>{winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>

            {/* Difficulty Breakdown */}
            <Text style={styles.sectionTitle}>Difficulty Breakdown</Text>
            <View style={styles.difficultyCard}>
              <View style={styles.difficultyItem}>
                <View style={styles.difficultyLeft}>
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor("easy") },
                    ]}
                  />
                  <Text style={styles.difficultyLabel}>Easy</Text>
                </View>
                <Text style={styles.difficultyValue}>
                  {difficultyStats.easy}/10
                </Text>
              </View>
              <View style={styles.difficultyDivider} />

              <View style={styles.difficultyItem}>
                <View style={styles.difficultyLeft}>
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor("medium") },
                    ]}
                  />
                  <Text style={styles.difficultyLabel}>Medium</Text>
                </View>
                <Text style={styles.difficultyValue}>
                  {difficultyStats.medium}/10
                </Text>
              </View>
              <View style={styles.difficultyDivider} />

              <View style={styles.difficultyItem}>
                <View style={styles.difficultyLeft}>
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor("hard") },
                    ]}
                  />
                  <Text style={styles.difficultyLabel}>Hard</Text>
                </View>
                <Text style={styles.difficultyValue}>
                  {difficultyStats.hard}/10
                </Text>
              </View>
              <View style={styles.difficultyDivider} />

              <View style={styles.difficultyItem}>
                <View style={styles.difficultyLeft}>
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor("very-hard") },
                    ]}
                  />
                  <Text style={styles.difficultyLabel}>Very Hard</Text>
                </View>
                <Text style={styles.difficultyValue}>
                  {difficultyStats["very-hard"]}/10
                </Text>
              </View>
              <View style={styles.difficultyDivider} />

              <View style={styles.difficultyItem}>
                <View style={styles.difficultyLeft}>
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor("extreme") },
                    ]}
                  />
                  <Text style={styles.difficultyLabel}>Extreme</Text>
                </View>
                <Text style={styles.difficultyValue}>
                  {difficultyStats.extreme}/10
                </Text>
              </View>
            </View>

            {/* Achievements */}
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsCard}>
              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    completedCount >= 1 && styles.achievementUnlocked,
                  ]}
                >
                  <Flame
                    size={20}
                    color={completedCount >= 1 ? "#FFD700" : Colors.text.muted}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>First Steps</Text>
                  <Text style={styles.achievementDesc}>
                    Complete your first level
                  </Text>
                </View>
                {completedCount >= 1 && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>

              <View style={styles.achievementDivider} />

              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    completedCount >= 10 && styles.achievementUnlocked,
                  ]}
                >
                  <Trophy
                    size={20}
                    color={completedCount >= 10 ? "#FFD700" : Colors.text.muted}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Getting Started</Text>
                  <Text style={styles.achievementDesc}>Complete 10 levels</Text>
                </View>
                {completedCount >= 10 && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>

              <View style={styles.achievementDivider} />

              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    completedCount >= 25 && styles.achievementUnlocked,
                  ]}
                >
                  <Target
                    size={20}
                    color={completedCount >= 25 ? "#FFD700" : Colors.text.muted}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>Halfway There</Text>
                  <Text style={styles.achievementDesc}>Complete 25 levels</Text>
                </View>
                {completedCount >= 25 && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>

              <View style={styles.achievementDivider} />

              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    completedCount >= 50 && styles.achievementUnlocked,
                  ]}
                >
                  <Award
                    size={20}
                    color={completedCount >= 50 ? "#FFD700" : Colors.text.muted}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>DropSphere Master</Text>
                  <Text style={styles.achievementDesc}>
                    Complete all 50 levels
                  </Text>
                </View>
                {completedCount >= 50 && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>
            </View>

            {/* Leaderboard Button */}
            <Pressable
              style={({ pressed }) => [
                styles.leaderboardButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={openLeaderboard}
            >
              <LinearGradient
                colors={Gradients.primary}
                style={styles.leaderboardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Users size={24} color={Colors.text.primary} />
                <Text style={styles.leaderboardButtonText}>
                  View Leaderboard
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.bottomSpacing} />
          </ScrollView>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  profileGradient: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  rankBadge: {
    position: "absolute",
    bottom: -4,
    right: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  progressSection: {
    alignItems: "center",
    width: "100%",
  },
  levelProgress: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  levelNumber: {
    fontSize: 40,
    fontWeight: "800",
    color: Colors.success,
  },
  levelTotal: {
    fontSize: 18,
    color: Colors.text.muted,
    fontWeight: "500",
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 12,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  difficultyCard: {
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  difficultyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  difficultyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  difficultyLabel: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: "500",
  },
  difficultyValue: {
    fontSize: 15,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
  difficultyDivider: {
    height: 1,
    backgroundColor: Colors.card.border,
  },
  achievementsCard: {
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementUnlocked: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  achievementDivider: {
    height: 1,
    backgroundColor: Colors.card.border,
  },
  leaderboardButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  leaderboardGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  leaderboardButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  bottomSpacing: {
    height: 20,
  },
});
