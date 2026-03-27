import { Colors, Gradients } from "@/constants/colors";
import {
  MAX_LEVELS,
  generateLevel,
  getDifficultyColor,
  useGame,
} from "@/context/GameContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, ChevronLeft, Lock } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 5;
const ITEM_SIZE = (width - 48 - 16 * 4) / NUM_COLUMNS;
const LEVEL_CARD_BACKGROUND_IMAGE = require("../assets/images/Card-level-bachground.png");

interface LevelItemProps {
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  onPress: (level: number) => void;
}

const LevelItem = React.memo(function LevelItem({
  level,
  isUnlocked,
  isCompleted,
  onPress,
}: LevelItemProps) {
  const levelData = useMemo(() => generateLevel(level), [level]);
  const difficultyColor = getDifficultyColor(levelData.difficulty);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.levelItem,
        !isUnlocked && styles.levelItemLocked,
        pressed && isUnlocked && styles.levelItemPressed,
        isCompleted && styles.levelItemCompleted,
      ]}
      onPress={() => isUnlocked && onPress(level)}
      disabled={!isUnlocked}
    >
      <ImageBackground
        source={LEVEL_CARD_BACKGROUND_IMAGE}
        style={styles.levelImageBg}
        imageStyle={styles.levelImageStyle}
        resizeMode="contain"
      >
        <LinearGradient
          colors={
            isCompleted
              ? ["rgba(0, 255, 171, 0.72)", "rgba(0, 210, 255, 0.5)"]
              : isUnlocked
                ? [difficultyColor + "99", "rgba(10, 14, 25, 0.45)"]
                : ["rgba(5, 8, 14, 0.82)", "rgba(5, 8, 14, 0.58)"]
          }
          style={styles.levelGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.topSeamLine} />

          {isCompleted ? (
            <Check size={20} color={Colors.text.primary} strokeWidth={3} />
          ) : (
            <Text
              style={[
                styles.levelNumber,
                {
                  color: isUnlocked
                    ? Colors.text.primary
                    : Colors.text.secondary,
                },
              ]}
            >
              {level}
            </Text>
          )}

          {!isUnlocked && (
            <View style={styles.lockedVeil}>
              <View style={styles.lockIconBadge}>
                <Lock size={12} color={Colors.text.primary} />
              </View>
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          )}

          <View style={styles.bottomSeamShade} />
        </LinearGradient>
      </ImageBackground>
      {isUnlocked && !isCompleted && (
        <View
          style={[
            styles.difficultyIndicator,
            { backgroundColor: difficultyColor },
          ]}
        />
      )}
    </Pressable>
  );
});

export default function LevelsScreen() {
  const router = useRouter();
  const { completedLevels, isLevelUnlocked, isLevelCompleted } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const selectLevel = useCallback(
    (level: number) => {
      router.push({
        pathname: "/game",
        params: { level: level.toString() },
      });
    },
    [router],
  );

  const levels = useMemo(
    () => Array.from({ length: MAX_LEVELS }, (_, i) => i + 1),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <LevelItem
        level={item}
        isUnlocked={isLevelUnlocked(item)}
        isCompleted={isLevelCompleted(item)}
        onPress={selectLevel}
      />
    ),
    [isLevelUnlocked, isLevelCompleted, selectLevel],
  );

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={goBack}>
              <ChevronLeft size={28} color={Colors.text.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>Select Level</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.difficulty.easy },
                ]}
              />
              <Text style={styles.legendText}>Easy</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.difficulty.medium },
                ]}
              />
              <Text style={styles.legendText}>Medium</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.difficulty.hard },
                ]}
              />
              <Text style={styles.legendText}>Hard</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.difficulty.extreme },
                ]}
              />
              <Text style={styles.legendText}>Extreme</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {completedLevels.length} / {MAX_LEVELS} completed
            </Text>
          </View>

          {/* Level Grid */}
          <FlatList
            data={levels}
            renderItem={renderItem}
            keyExtractor={(item) => item.toString()}
            numColumns={NUM_COLUMNS}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
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
  placeholder: {
    width: 44,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  progressInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: Colors.text.muted,
    fontWeight: "500",
  },
  gridContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  levelItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.card.border,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  levelItemLocked: {
    opacity: 0.95,
  },
  levelItemPressed: {
    transform: [{ scale: 0.95 }],
  },
  levelItemCompleted: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  levelImageBg: {
    flex: 1,
    backgroundColor: "rgba(8, 12, 20, 0.92)",
  },
  levelImageStyle: {
    borderRadius: 16,
    opacity: 0.95,
  },
  levelGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  difficultyIndicator: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    width: 12,
    height: 3,
    borderRadius: 2,
  },
  topSeamLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  bottomSeamShade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  lockedVeil: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 10,
    backgroundColor: "rgba(3, 5, 10, 0.55)",
    paddingVertical: 4,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  lockIconBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  lockedText: {
    color: Colors.text.secondary,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
