import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Colors } from "@/constants/colors";

export type LevelStatus = "locked" | "unlocked" | "completed";

export interface LevelData {
  id: number;
  status: LevelStatus;
  bestTime?: number;
}

export interface GameState {
  currentLevel: number;
  levels: LevelData[];
  totalLevels: number;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export const TOTAL_LEVELS = 50;
export const MAX_LEVELS = 50;

export type Difficulty = "easy" | "medium" | "hard" | "very-hard" | "extreme";

export interface LevelConfig {
  difficulty: Difficulty;
  platformCount: number;
  platformGap: number;
  ballSpeed: number;
  hasMovingPlatforms: boolean;
  hasGaps: boolean;
  hasTraps: boolean;
}

export const getLevelDifficulty = (levelId: number): Difficulty => {
  if (levelId <= 10) return "easy";
  if (levelId <= 20) return "medium";
  if (levelId <= 30) return "hard";
  if (levelId <= 40) return "very-hard";
  return "extreme";
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "easy":
      return Colors.difficulty.easy;
    case "medium":
      return Colors.difficulty.medium;
    case "hard":
      return Colors.difficulty.hard;
    case "very-hard":
      return "#FF6B6B";
    case "extreme":
      return Colors.difficulty.extreme;
    default:
      return Colors.text.primary;
  }
};

export const generateLevel = (levelId: number): LevelConfig => {
  const difficulty = getLevelDifficulty(levelId);

  const baseConfig: Omit<LevelConfig, "difficulty"> = {
    platformCount: 10,
    platformGap: 80,
    ballSpeed: 1,
    hasMovingPlatforms: false,
    hasGaps: false,
    hasTraps: false,
  };

  switch (difficulty) {
    case "easy":
      return {
        ...baseConfig,
        difficulty,
        platformCount: 8 + Math.floor(levelId / 2),
        ballSpeed: 1 + levelId * 0.05,
      };
    case "medium":
      return {
        ...baseConfig,
        difficulty,
        platformCount: 10 + Math.floor((levelId - 10) / 2),
        ballSpeed: 1.5 + (levelId - 10) * 0.08,
        hasMovingPlatforms: levelId > 15,
      };
    case "hard":
      return {
        ...baseConfig,
        difficulty,
        platformCount: 12 + Math.floor((levelId - 20) / 2),
        ballSpeed: 2 + (levelId - 20) * 0.1,
        hasMovingPlatforms: true,
        hasGaps: levelId > 25,
      };
    case "very-hard":
      return {
        ...baseConfig,
        difficulty,
        platformCount: 14 + Math.floor((levelId - 30) / 2),
        ballSpeed: 2.5 + (levelId - 30) * 0.1,
        hasMovingPlatforms: true,
        hasGaps: true,
      };
    case "extreme":
      return {
        ...baseConfig,
        difficulty,
        platformCount: 16 + Math.floor((levelId - 40) / 2),
        ballSpeed: 3 + (levelId - 40) * 0.15,
        hasMovingPlatforms: true,
        hasGaps: true,
        hasTraps: levelId > 45,
      };
  }
};

const createInitialLevels = (): LevelData[] => {
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    id: i + 1,
    status: i === 0 ? "unlocked" : "locked",
  }));
};

export const [GameContext, useGame] = createContextHook(() => {
  const [state, setState] = useState<GameState>({
    currentLevel: 1,
    levels: createInitialLevels(),
    totalLevels: TOTAL_LEVELS,
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalWins, setTotalWins] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem("dropsphere_progress");
        const savedAuth = await AsyncStorage.getItem("dropsphere_auth");
        const savedStats = await AsyncStorage.getItem("dropsphere_stats");

        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setState((prev) => ({
            ...prev,
            currentLevel: parsed.currentLevel || 1,
            levels: parsed.levels || createInitialLevels(),
          }));
        }

        if (savedAuth) {
          const auth = JSON.parse(savedAuth);
          setState((prev) => ({
            ...prev,
            isAuthenticated: auth.isAuthenticated || false,
            user: auth.user || null,
          }));
        }

        if (savedStats) {
          const stats = JSON.parse(savedStats);
          setTotalWins(stats.totalWins || 0);
          setTotalAttempts(stats.totalAttempts || 0);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveProgress = async () => {
        try {
          await AsyncStorage.setItem(
            "dropsphere_progress",
            JSON.stringify({
              currentLevel: state.currentLevel,
              levels: state.levels,
            }),
          );
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      };

      void saveProgress();
    }
  }, [state.currentLevel, state.levels, isLoading]);

  // Save auth state
  useEffect(() => {
    if (!isLoading) {
      const saveAuth = async () => {
        try {
          await AsyncStorage.setItem(
            "dropsphere_auth",
            JSON.stringify({
              isAuthenticated: state.isAuthenticated,
              user: state.user,
            }),
          );
        } catch (error) {
          console.error("Error saving auth:", error);
        }
      };

      void saveAuth();
    }
  }, [state.isAuthenticated, state.user, isLoading]);

  // Save stats
  useEffect(() => {
    if (!isLoading) {
      const saveStats = async () => {
        try {
          await AsyncStorage.setItem(
            "dropsphere_stats",
            JSON.stringify({
              totalWins,
              totalAttempts,
            }),
          );
        } catch (error) {
          console.error("Error saving stats:", error);
        }
      };

      void saveStats();
    }
  }, [totalWins, totalAttempts, isLoading]);

  const completeLevel = useCallback((levelId: number, time?: number) => {
    setTotalWins((prev) => prev + 1);
    setState((prev) => {
      const newLevels = [...prev.levels];
      const levelIndex = levelId - 1;

      // Mark current level as completed
      if (newLevels[levelIndex]) {
        newLevels[levelIndex] = {
          ...newLevels[levelIndex],
          status: "completed",
          bestTime:
            time &&
            (!newLevels[levelIndex].bestTime ||
              time < newLevels[levelIndex].bestTime!)
              ? time
              : newLevels[levelIndex].bestTime,
        };
      }

      // Unlock next level if exists
      if (levelIndex + 1 < newLevels.length) {
        newLevels[levelIndex + 1] = {
          ...newLevels[levelIndex + 1],
          status: "unlocked",
        };
      }

      return {
        ...prev,
        currentLevel: Math.min(levelId + 1, TOTAL_LEVELS),
        levels: newLevels,
      };
    });
  }, []);

  const addAttempt = useCallback(() => {
    setTotalAttempts((prev) => prev + 1);
  }, []);

  const setCurrentLevel = useCallback((levelId: number) => {
    setState((prev) => ({
      ...prev,
      currentLevel: Math.max(1, Math.min(levelId, TOTAL_LEVELS)),
    }));
  }, []);

  const getLevelStatus = useCallback(
    (levelId: number): LevelStatus => {
      const level = state.levels[levelId - 1];
      return level?.status || "locked";
    },
    [state.levels],
  );

  const login = useCallback(
    (userData: { id: string; name: string; email: string }) => {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: userData,
      }));
    },
    [],
  );

  const logout = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentLevel: 1,
      levels: createInitialLevels(),
    }));
    setTotalWins(0);
    setTotalAttempts(0);
  }, []);

  const getCompletedCount = useCallback(() => {
    return state.levels.filter((l) => l.status === "completed").length;
  }, [state.levels]);

  const getUnlockedCount = useCallback(() => {
    return state.levels.filter((l) => l.status !== "locked").length;
  }, [state.levels]);

  const isLevelUnlocked = useCallback(
    (levelId: number): boolean => {
      return getLevelStatus(levelId) !== "locked";
    },
    [getLevelStatus],
  );

  const isLevelCompleted = useCallback(
    (levelId: number): boolean => {
      return getLevelStatus(levelId) === "completed";
    },
    [getLevelStatus],
  );

  const progressPercentage = useMemo(() => {
    return (getCompletedCount() / TOTAL_LEVELS) * 100;
  }, [getCompletedCount]);

  const completedLevels = useMemo(() => {
    return state.levels
      .filter((l) => l.status === "completed")
      .map((l) => l.id);
  }, [state.levels]);

  // Wrap return value in useMemo for optimization
  return useMemo(
    () => ({
      // From state
      currentLevel: state.currentLevel,
      levels: state.levels,
      totalLevels: state.totalLevels,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      isLoading,

      // Stats
      totalWins,
      totalAttempts,
      completedLevels,
      progressPercentage,

      // Methods
      completeLevel,
      addAttempt,
      setCurrentLevel,
      getLevelStatus,
      login,
      logout,
      resetProgress,
      getCompletedCount,
      getUnlockedCount,
      isLevelUnlocked,
      isLevelCompleted,
    }),
    [
      state,
      isLoading,
      totalWins,
      totalAttempts,
      completedLevels,
      progressPercentage,
      completeLevel,
      addAttempt,
      setCurrentLevel,
      getLevelStatus,
      login,
      logout,
      resetProgress,
      getCompletedCount,
      getUnlockedCount,
      isLevelUnlocked,
      isLevelCompleted,
    ],
  );
});
