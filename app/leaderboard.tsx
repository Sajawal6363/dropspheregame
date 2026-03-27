import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Target,
  Search,
  TrendingUp,
  Flame,
} from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";
import {
  useGame,
  getLevelDifficulty,
  getDifficultyColor,
  type Difficulty,
} from "@/context/GameContext";

const { width } = Dimensions.get("window");

interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rank: string;
  rankColor: string;
  completedLevels: number;
  totalWins: number;
  totalAttempts: number;
  streak: number;
  bestTime: number;
  difficultyStats: Record<Difficulty, number>;
}

const MOCK_PLAYERS: PlayerProfile[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    avatar: "A",
    rank: "Legend",
    rankColor: "#FFD700",
    completedLevels: 50,
    totalWins: 68,
    totalAttempts: 89,
    streak: 12,
    bestTime: 45,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 10,
      "very-hard": 10,
      extreme: 10,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "S",
    rank: "Master",
    rankColor: "#FF6B6B",
    completedLevels: 42,
    totalWins: 55,
    totalAttempts: 72,
    streak: 8,
    bestTime: 52,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 10,
      "very-hard": 2,
      extreme: 0,
    },
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    avatar: "M",
    rank: "Expert",
    rankColor: "#00D2FF",
    completedLevels: 38,
    totalWins: 48,
    totalAttempts: 65,
    streak: 5,
    bestTime: 58,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 10,
      "very-hard": 8,
      extreme: 0,
    },
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    avatar: "E",
    rank: "Expert",
    rankColor: "#00D2FF",
    completedLevels: 35,
    totalWins: 42,
    totalAttempts: 58,
    streak: 6,
    bestTime: 61,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 10,
      "very-hard": 5,
      extreme: 0,
    },
  },
  {
    id: "5",
    name: "James Brown",
    email: "james.b@example.com",
    avatar: "J",
    rank: "Advanced",
    rankColor: "#9B59B6",
    completedLevels: 28,
    totalWins: 35,
    totalAttempts: 48,
    streak: 4,
    bestTime: 68,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 8,
      "very-hard": 0,
      extreme: 0,
    },
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    avatar: "L",
    rank: "Advanced",
    rankColor: "#9B59B6",
    completedLevels: 24,
    totalWins: 31,
    totalAttempts: 42,
    streak: 3,
    bestTime: 72,
    difficultyStats: {
      easy: 10,
      medium: 10,
      hard: 4,
      "very-hard": 0,
      extreme: 0,
    },
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.l@example.com",
    avatar: "D",
    rank: "Intermediate",
    rankColor: "#3498DB",
    completedLevels: 18,
    totalWins: 25,
    totalAttempts: 38,
    streak: 2,
    bestTime: 78,
    difficultyStats: {
      easy: 10,
      medium: 8,
      hard: 0,
      "very-hard": 0,
      extreme: 0,
    },
  },
  {
    id: "8",
    name: "Sophie Taylor",
    email: "sophie.t@example.com",
    avatar: "S",
    rank: "Intermediate",
    rankColor: "#3498DB",
    completedLevels: 15,
    totalWins: 22,
    totalAttempts: 35,
    streak: 3,
    bestTime: 82,
    difficultyStats: {
      easy: 10,
      medium: 5,
      hard: 0,
      "very-hard": 0,
      extreme: 0,
    },
  },
  {
    id: "9",
    name: "Ryan Martinez",
    email: "ryan.m@example.com",
    avatar: "R",
    rank: "Beginner",
    rankColor: "#95A5A6",
    completedLevels: 8,
    totalWins: 12,
    totalAttempts: 22,
    streak: 1,
    bestTime: 95,
    difficultyStats: {
      easy: 8,
      medium: 0,
      hard: 0,
      "very-hard": 0,
      extreme: 0,
    },
  },
  {
    id: "10",
    name: "Olivia Garcia",
    email: "olivia.g@example.com",
    avatar: "O",
    rank: "Beginner",
    rankColor: "#95A5A6",
    completedLevels: 5,
    totalWins: 8,
    totalAttempts: 18,
    streak: 1,
    bestTime: 110,
    difficultyStats: {
      easy: 5,
      medium: 0,
      hard: 0,
      "very-hard": 0,
      extreme: 0,
    },
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { user, totalWins, totalAttempts, getCompletedCount, completedLevels } =
    useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(
    null,
  );

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
  }, [fadeAnim, slideAnim]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const currentPlayer: PlayerProfile = useMemo(() => {
    const completedCount = getCompletedCount();
    const totalLosses = totalAttempts - totalWins;
    const winRate =
      totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : 0;

    let rank = "Beginner";
    let rankColor = "#95A5A6";
    if (completedCount >= 45) {
      rank = "Legend";
      rankColor = "#FFD700";
    } else if (completedCount >= 35) {
      rank = "Master";
      rankColor = "#FF6B6B";
    } else if (completedCount >= 25) {
      rank = "Expert";
      rankColor = "#00D2FF";
    } else if (completedCount >= 15) {
      rank = "Advanced";
      rankColor = "#9B59B6";
    } else if (completedCount >= 5) {
      rank = "Intermediate";
      rankColor = "#3498DB";
    }

    const diffStats = {
      easy: 0,
      medium: 0,
      hard: 0,
      "very-hard": 0,
      extreme: 0,
    };
    completedLevels.forEach((levelId: number) => {
      const diff = getLevelDifficulty(levelId);
      diffStats[diff]++;
    });

    return {
      id: "current",
      name: user?.name || "You",
      email: user?.email || "player@example.com",
      avatar: (user?.name?.charAt(0) || "Y").toUpperCase(),
      rank,
      rankColor,
      completedLevels: completedCount,
      totalWins,
      totalAttempts,
      streak: Math.min(Math.floor(totalWins / 5), 15),
      bestTime: 60,
      difficultyStats: diffStats,
      winRate,
      totalLosses,
    };
  }, [user, totalWins, totalAttempts, getCompletedCount, completedLevels]);

  const allPlayers = useMemo(() => {
    return [currentPlayer, ...MOCK_PLAYERS].sort(
      (a, b) => b.completedLevels - a.completedLevels,
    );
  }, [currentPlayer]);

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return allPlayers;
    return allPlayers.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allPlayers, searchQuery]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy size={20} color="#FFD700" />;
    if (index === 1) return <Medal size={20} color="#C0C0C0" />;
    if (index === 2) return <Award size={20} color="#CD7F32" />;
    return <Text style={styles.rankNumber}>{index + 1}</Text>;
  };

  const PlayerDetailModal = ({
    player,
    onClose,
  }: {
    player: PlayerProfile;
    onClose: () => void;
  }) => {
    const winRate =
      player.totalAttempts > 0
        ? Math.round((player.totalWins / player.totalAttempts) * 100)
        : 0;
    const totalLosses = player.totalAttempts - player.totalWins;

    return (
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(15, 32, 39, 0.98)", "rgba(32, 58, 67, 0.98)"]}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.rankBadge,
                  { backgroundColor: player.rankColor },
                ]}
              >
                <Text style={styles.rankBadgeText}>{player.rank}</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.playerHeader}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>{player.avatar}</Text>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerEmail}>{player.email}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.playerStatsGrid}>
                <View style={styles.playerStatItem}>
                  <Trophy size={24} color={Colors.success} />
                  <Text style={styles.playerStatValue}>
                    {player.completedLevels}
                  </Text>
                  <Text style={styles.playerStatLabel}>Levels</Text>
                </View>
                <View style={styles.playerStatItem}>
                  <Target size={24} color={Colors.primary} />
                  <Text style={styles.playerStatValue}>{player.totalWins}</Text>
                  <Text style={styles.playerStatLabel}>Wins</Text>
                </View>
                <View style={styles.playerStatItem}>
                  <Flame size={24} color={Colors.danger} />
                  <Text style={styles.playerStatValue}>{totalLosses}</Text>
                  <Text style={styles.playerStatLabel}>Losses</Text>
                </View>
                <View style={styles.playerStatItem}>
                  <TrendingUp size={24} color={Colors.secondary} />
                  <Text style={styles.playerStatValue}>{winRate}%</Text>
                  <Text style={styles.playerStatLabel}>Win Rate</Text>
                </View>
              </View>

              <Text style={styles.modalSectionTitle}>Difficulty Progress</Text>
              <View style={styles.difficultyList}>
                {(
                  [
                    "easy",
                    "medium",
                    "hard",
                    "very-hard",
                    "extreme",
                  ] as Difficulty[]
                ).map((diff) => (
                  <View key={diff} style={styles.difficultyRow}>
                    <View style={styles.difficultyLeft}>
                      <View
                        style={[
                          styles.difficultyDot,
                          { backgroundColor: getDifficultyColor(diff) },
                        ]}
                      />
                      <Text style={styles.difficultyText}>
                        {diff === "very-hard"
                          ? "Very Hard"
                          : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.difficultyCount}>
                      {player.difficultyStats?.[diff] || 0}/10
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

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
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <View style={styles.backButton} />
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.text.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search players..."
              placeholderTextColor={Colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Top 3 Podium */}
          {filteredPlayers.length >= 3 && !searchQuery && (
            <View style={styles.podiumContainer}>
              <View style={styles.podiumRow}>
                {/* 2nd Place */}
                <View style={[styles.podiumItem, styles.secondPlace]}>
                  <View
                    style={[styles.podiumAvatar, { borderColor: "#C0C0C0" }]}
                  >
                    <Text style={styles.podiumAvatarText}>
                      {filteredPlayers[1]?.avatar}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {filteredPlayers[1]?.name}
                  </Text>
                  <View
                    style={[styles.podiumBadge, { backgroundColor: "#C0C0C0" }]}
                  >
                    <Text style={styles.podiumBadgeText}>2</Text>
                  </View>
                  <Text style={styles.podiumLevels}>
                    {filteredPlayers[1]?.completedLevels} levels
                  </Text>
                </View>

                {/* 1st Place */}
                <View style={[styles.podiumItem, styles.firstPlace]}>
                  <View
                    style={[
                      styles.podiumAvatar,
                      { borderColor: "#FFD700", width: 72, height: 72 },
                    ]}
                  >
                    <Text style={[styles.podiumAvatarText, { fontSize: 28 }]}>
                      {filteredPlayers[0]?.avatar}
                    </Text>
                    <View style={styles.crown}>
                      <Trophy size={16} color="#FFD700" />
                    </View>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {filteredPlayers[0]?.name}
                  </Text>
                  <View
                    style={[styles.podiumBadge, { backgroundColor: "#FFD700" }]}
                  >
                    <Text style={styles.podiumBadgeText}>1</Text>
                  </View>
                  <Text style={styles.podiumLevels}>
                    {filteredPlayers[0]?.completedLevels} levels
                  </Text>
                </View>

                {/* 3rd Place */}
                <View style={[styles.podiumItem, styles.thirdPlace]}>
                  <View
                    style={[styles.podiumAvatar, { borderColor: "#CD7F32" }]}
                  >
                    <Text style={styles.podiumAvatarText}>
                      {filteredPlayers[2]?.avatar}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {filteredPlayers[2]?.name}
                  </Text>
                  <View
                    style={[styles.podiumBadge, { backgroundColor: "#CD7F32" }]}
                  >
                    <Text style={styles.podiumBadgeText}>3</Text>
                  </View>
                  <Text style={styles.podiumLevels}>
                    {filteredPlayers[2]?.completedLevels} levels
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Player List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            <Text style={styles.listTitle}>All Players</Text>
            {filteredPlayers.map((player, index) => (
              <Pressable
                key={player.id}
                style={({ pressed }) => [
                  styles.playerCard,
                  pressed && styles.cardPressed,
                  player.id === "current" && styles.currentPlayerCard,
                ]}
                onPress={() => setSelectedPlayer(player)}
              >
                <View style={styles.playerRank}>{getRankIcon(index)}</View>
                <View style={styles.playerAvatarSmall}>
                  <Text style={styles.playerAvatarSmallText}>
                    {player.avatar}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <View style={styles.playerNameRow}>
                    <Text style={styles.playerListName}>{player.name}</Text>
                    {player.id === "current" && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.playerStatsRow}>
                    <Text
                      style={[
                        styles.playerRankLabel,
                        { color: player.rankColor },
                      ]}
                    >
                      {player.rank}
                    </Text>
                    <Text style={styles.statSeparator}>•</Text>
                    <Text style={styles.playerLevels}>
                      {player.completedLevels} levels
                    </Text>
                  </View>
                </View>
                <View style={styles.playerWinRate}>
                  <Text style={styles.winRateValue}>
                    {player.totalAttempts > 0
                      ? Math.round(
                          (player.totalWins / player.totalAttempts) * 100,
                        )
                      : 0}
                    %
                  </Text>
                  <Text style={styles.winRateLabel}>WR</Text>
                </View>
              </Pressable>
            ))}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card.background,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  podiumContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 12,
  },
  podiumItem: {
    alignItems: "center",
  },
  firstPlace: {
    transform: [{ translateY: -10 }],
  },
  secondPlace: {
    opacity: 0.9,
  },
  thirdPlace: {
    opacity: 0.85,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginBottom: 8,
  },
  crown: {
    position: "absolute",
    top: -8,
    backgroundColor: Colors.card.background,
    borderRadius: 10,
    padding: 4,
  },
  podiumAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
    maxWidth: 100,
  },
  podiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  podiumBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
  podiumLevels: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  currentPlayerCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  playerRank: {
    width: 36,
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.muted,
  },
  playerAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(108, 92, 231, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playerAvatarSmallText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerListName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  youBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  playerStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  playerRankLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  statSeparator: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  playerLevels: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  playerWinRate: {
    alignItems: "center",
  },
  winRateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.success,
  },
  winRateLabel: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: width - 40,
    maxHeight: "80%",
    borderRadius: 24,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  playerHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  playerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  playerAvatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  playerName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  playerEmail: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 2,
  },
  playerStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  playerStatItem: {
    width: (width - 100) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  playerStatValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
    marginVertical: 8,
  },
  playerStatLabel: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  difficultyList: {
    gap: 8,
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
  },
  difficultyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "500",
  },
  difficultyCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
});
