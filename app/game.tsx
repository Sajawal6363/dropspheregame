import { Colors, Gradients } from "@/constants/colors";
import { generateLevel, LevelConfig, useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pause, RotateCcw } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BALL_SIZE = 40;
const PLATFORM_HEIGHT = 12;
const GAME_WIDTH = SCREEN_WIDTH - 48;

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  isMoving?: boolean;
  speed?: number;
  direction?: number;
  minX?: number;
  maxX?: number;
  isTrap?: boolean;
}

interface GameState {
  ballX: number;
  ballY: number;
  ballVelocityX: number;
  ballVelocityY: number;
  isGameOver: boolean;
  isPaused: boolean;
  startTime: number;
}

export default function GameScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const { currentLevel, completeLevel, addAttempt } = useGame();
  const {
    musicEnabled,
    soundEnabled,
    isLoading: isSettingsLoading,
  } = useSettings();

  const levelId = useMemo(
    () => (level ? parseInt(level, 10) : currentLevel),
    [level, currentLevel],
  );
  const levelConfig = useMemo(() => generateLevel(levelId), [levelId]);

  // Animated values
  const ballX = useRef(
    new Animated.Value(GAME_WIDTH / 2 - BALL_SIZE / 2),
  ).current;
  const ballY = useRef(new Animated.Value(100)).current;
  const gameOffset = useRef(new Animated.Value(0)).current;

  // Game state refs (for animation loop)
  const gameStateRef = useRef<GameState>({
    ballX: GAME_WIDTH / 2 - BALL_SIZE / 2,
    ballY: 100,
    ballVelocityX: 0,
    ballVelocityY: 0,
    isGameOver: false,
    isPaused: false,
    startTime: Date.now(),
  });

  const platformsRef = useRef<Platform[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const gameMusicRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showFallWarning, setShowFallWarning] = useState(false);

  const ensureGameMusicLoaded = useCallback(async () => {
    if (gameMusicRef.current) {
      return gameMusicRef.current;
    }

    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/audio/dropsphere-theme.wav"),
      {
        isLooping: true,
        volume: 0.45,
        shouldPlay: false,
      },
    );

    gameMusicRef.current = sound;
    return sound;
  }, []);

  const stopGameMusic = useCallback(() => {
    const sound = gameMusicRef.current;
    if (!sound) {
      return;
    }

    void sound.pauseAsync().catch(() => undefined);
  }, []);

  const triggerLose = useCallback(() => {
    if (gameStateRef.current.isGameOver) {
      return;
    }

    gameStateRef.current.isGameOver = true;
    gameStateRef.current.isPaused = true;
    addAttempt();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    stopGameMusic();

    router.replace({
      pathname: "/lose",
      params: { level: levelId.toString() },
    });
  }, [addAttempt, levelId, router, stopGameMusic]);

  const triggerWin = useCallback(() => {
    if (gameStateRef.current.isGameOver) {
      return;
    }

    gameStateRef.current.isGameOver = true;
    gameStateRef.current.isPaused = true;

    const time = Date.now() - gameStateRef.current.startTime;
    completeLevel(levelId, time);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    stopGameMusic();

    router.replace({
      pathname: "/win",
      params: { level: levelId.toString(), time: time.toString() },
    });
  }, [completeLevel, levelId, router, stopGameMusic]);

  // Generate platforms based on level config
  const generatePlatforms = useCallback((config: LevelConfig): Platform[] => {
    const platforms: Platform[] = [];
    const platformWidth = config.hasGaps ? 80 : 100;
    const gap = config.platformGap;

    for (let i = 0; i < config.platformCount; i++) {
      const y = 200 + i * gap;
      let x = Math.random() * (GAME_WIDTH - platformWidth);

      // Ensure first platform is reachable
      if (i === 0) {
        x = GAME_WIDTH / 2 - platformWidth / 2;
      }

      const platform: Platform = {
        id: i,
        x,
        y,
        width: platformWidth,
        isMoving: config.hasMovingPlatforms && i > 2 && Math.random() > 0.5,
        isTrap: config.hasTraps && i > 5 && Math.random() > 0.7,
        speed: config.ballSpeed * (0.5 + Math.random()),
        direction: Math.random() > 0.5 ? 1 : -1,
        minX: 0,
        maxX: GAME_WIDTH - platformWidth,
      };

      platforms.push(platform);
    }

    // Add finish platform
    platforms.push({
      id: config.platformCount,
      x: GAME_WIDTH / 2 - 60,
      y: 200 + config.platformCount * gap,
      width: 120,
      isTrap: false,
    });

    return platforms;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    platformsRef.current = generatePlatforms(levelConfig);
    gameStateRef.current = {
      ballX: GAME_WIDTH / 2 - BALL_SIZE / 2,
      ballY: 100,
      ballVelocityX: 0,
      ballVelocityY: 0,
      isGameOver: false,
      isPaused: false,
      startTime: Date.now(),
    };

    ballX.setValue(GAME_WIDTH / 2 - BALL_SIZE / 2);
    ballY.setValue(100);
    gameOffset.setValue(0);
    setElapsedMs(0);
    setProgressPercent(0);
    setShowFallWarning(false);
    setIsPlaying(true);
    setShowPauseMenu(false);
  }, [levelConfig, generatePlatforms, ballX, ballY, gameOffset]);

  // Physics update loop
  const updatePhysics = useCallback(() => {
    if (gameStateRef.current.isGameOver || gameStateRef.current.isPaused) {
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    const state = gameStateRef.current;
    const platforms = platformsRef.current;

    // Apply gravity
    state.ballVelocityY += 0.5;
    state.ballVelocityX *= 0.98; // Friction

    // Update position
    state.ballX += state.ballVelocityX;
    state.ballY += state.ballVelocityY;

    // Screen bounds
    if (state.ballX < 0) {
      state.ballX = 0;
      state.ballVelocityX = 0;
    }
    if (state.ballX > GAME_WIDTH - BALL_SIZE) {
      state.ballX = GAME_WIDTH - BALL_SIZE;
      state.ballVelocityX = 0;
    }

    // Check platform collisions
    for (const platform of platforms) {
      // Update moving platforms
      if (
        platform.isMoving &&
        platform.minX !== undefined &&
        platform.maxX !== undefined
      ) {
        platform.x += (platform.speed || 1) * (platform.direction || 1);
        if (platform.x <= platform.minX || platform.x >= platform.maxX) {
          platform.direction = -(platform.direction || 1);
        }
      }

      // Check collision
      const ballBottom = state.ballY + BALL_SIZE;
      const ballCenterX = state.ballX + BALL_SIZE / 2;

      if (
        state.ballVelocityY > 0 &&
        ballBottom >= platform.y &&
        ballBottom <= platform.y + PLATFORM_HEIGHT + 10 &&
        ballCenterX >= platform.x &&
        ballCenterX <= platform.x + platform.width
      ) {
        if (platform.isTrap) {
          triggerLose();
          return;
        }

        // Land on platform
        state.ballY = platform.y - BALL_SIZE;
        state.ballVelocityY = 0;

        // Check if reached finish (last platform)
        if (platform.id === platforms.length - 1) {
          triggerWin();
          return;
        }
      }
    }

    // Check if fell off screen
    const cameraOffset = Math.max(0, state.ballY - SCREEN_HEIGHT / 2);
    const finalPlatformY = platforms[platforms.length - 1]?.y ?? SCREEN_HEIGHT;
    const fallThreshold = finalPlatformY + 260;

    if (state.ballY > fallThreshold) {
      triggerLose();
      return;
    }

    // Update animated values
    ballX.setValue(state.ballX);
    ballY.setValue(state.ballY);
    gameOffset.setValue(-cameraOffset);

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [ballX, ballY, gameOffset, triggerLose, triggerWin]);

  // Pan responder for controls
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gameStateRef.current.isGameOver || gameStateRef.current.isPaused)
          return;

        const sensitivity = 0.8;
        gameStateRef.current.ballVelocityX +=
          gestureState.dx * 0.01 * sensitivity;

        // Clamp velocity
        gameStateRef.current.ballVelocityX = Math.max(
          -15,
          Math.min(15, gameStateRef.current.ballVelocityX),
        );
      },
      onPanResponderRelease: () => {
        // Momentum continues with friction
      },
    }),
  ).current;

  // Start game
  useEffect(() => {
    initGame();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initGame]);

  // Start physics loop
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updatePhysics]);

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
    const syncGameMusic = async () => {
      if (isSettingsLoading || !musicEnabled || !soundEnabled) {
        stopGameMusic();
        return;
      }

      const shouldPlay =
        isPlaying && !showPauseMenu && !gameStateRef.current.isGameOver;

      const sound = await ensureGameMusicLoaded();
      const status = await sound.getStatusAsync();

      if (!status.isLoaded) {
        return;
      }

      if (shouldPlay && !status.isPlaying) {
        await sound.playAsync();
      }

      if (!shouldPlay && status.isPlaying) {
        await sound.pauseAsync();
      }
    };

    void syncGameMusic();
  }, [
    ensureGameMusicLoaded,
    isSettingsLoading,
    isPlaying,
    musicEnabled,
    soundEnabled,
    showPauseMenu,
    stopGameMusic,
  ]);

  useEffect(() => {
    return () => {
      const sound = gameMusicRef.current;
      gameMusicRef.current = null;

      if (sound) {
        void sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || gameStateRef.current.isGameOver) {
      return;
    }

    const hudTimer = setInterval(() => {
      const state = gameStateRef.current;
      const finishPlatformY =
        platformsRef.current[platformsRef.current.length - 1]?.y ??
        SCREEN_HEIGHT;
      const normalized = Math.max(
        0,
        Math.min(1, state.ballY / finishPlatformY),
      );

      setElapsedMs(Date.now() - state.startTime);
      setProgressPercent(normalized * 100);
      setShowFallWarning(state.ballY > finishPlatformY - 80);
    }, 120);

    return () => clearInterval(hudTimer);
  }, [isPlaying]);

  const formatTime = useCallback((ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const goBack = useCallback(() => {
    gameStateRef.current.isPaused = true;
    stopGameMusic();
    router.back();
  }, [router, stopGameMusic]);

  const pauseGame = useCallback(() => {
    gameStateRef.current.isPaused = true;
    setShowPauseMenu(true);
  }, []);

  const resumeGame = useCallback(() => {
    gameStateRef.current.isPaused = false;
    setShowPauseMenu(false);
  }, []);

  const restartLevel = useCallback(() => {
    addAttempt();
    initGame();
  }, [addAttempt, initGame]);

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={goBack}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </Pressable>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {levelId}</Text>
          </View>
          <Pressable style={styles.headerButton} onPress={pauseGame}>
            <Pause size={24} color={Colors.text.primary} />
          </Pressable>
        </View>

        <View style={styles.hudCard}>
          <View style={styles.hudRow}>
            <Text style={styles.hudLabel}>Time</Text>
            <Text style={styles.hudValue}>{formatTime(elapsedMs)}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
              ]}
            />
          </View>

          <View style={styles.hudRow}>
            <Text style={styles.hudHint}>Reach the GOAL platform</Text>
            <Text style={styles.hudPercent}>
              {Math.round(progressPercent)}%
            </Text>
          </View>

          {showFallWarning ? (
            <Text style={styles.warningText}>
              Careful: one bad drop can fail the level.
            </Text>
          ) : null}
        </View>

        {/* Game Area */}
        <View style={styles.gameContainer} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.gameWorld,
              {
                transform: [{ translateY: gameOffset }],
              },
            ]}
          >
            {/* Platforms */}
            {platformsRef.current.map((platform) => (
              <View
                key={platform.id}
                style={[
                  styles.platform,
                  {
                    left: platform.x,
                    top: platform.y,
                    width: platform.width,
                    backgroundColor: platform.isTrap
                      ? Colors.platform.trap
                      : platform.id === platformsRef.current.length - 1
                        ? Colors.platform.finish
                        : platform.isMoving
                          ? Colors.platform.moving
                          : Colors.platform.normal,
                  },
                ]}
              >
                {platform.id === platformsRef.current.length - 1 && (
                  <Text style={styles.finishText}>GOAL</Text>
                )}
              </View>
            ))}

            {/* Ball */}
            <Animated.View
              style={[
                styles.ball,
                {
                  transform: [{ translateX: ballX }, { translateY: ballY }],
                },
              ]}
            >
              <LinearGradient
                colors={Gradients.ball}
                style={styles.ballGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.ballShine} />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>Swipe left/right to move</Text>
          </View>
        </View>

        {/* Pause Menu */}
        {showPauseMenu && (
          <View style={styles.overlay}>
            <View style={styles.pauseMenu}>
              <Text style={styles.pauseTitle}>Paused</Text>
              <Pressable style={styles.menuButton} onPress={resumeGame}>
                <Text style={styles.menuButtonText}>Resume</Text>
              </Pressable>
              <Pressable style={styles.menuButton} onPress={restartLevel}>
                <RotateCcw size={20} color={Colors.text.primary} />
                <Text style={styles.menuButtonText}>Restart</Text>
              </Pressable>
              <Pressable
                style={[styles.menuButton, styles.menuButtonSecondary]}
                onPress={goBack}
              >
                <Text style={styles.menuButtonTextSecondary}>Quit</Text>
              </Pressable>
            </View>
          </View>
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  levelBadge: {
    backgroundColor: Colors.card.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  levelText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  hudCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: "rgba(8, 13, 20, 0.42)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.card.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  hudRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hudLabel: {
    color: Colors.text.muted,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  hudValue: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  hudHint: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  hudPercent: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  warningText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: "600",
  },
  gameContainer: {
    flex: 1,
    marginHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  gameWorld: {
    width: GAME_WIDTH,
    height: SCREEN_HEIGHT * 2,
  },
  platform: {
    position: "absolute",
    height: PLATFORM_HEIGHT,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  finishText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  ball: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  ballGradient: {
    width: "100%",
    height: "100%",
    borderRadius: BALL_SIZE / 2,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 6,
  },
  ballShine: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  instructions: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: Colors.text.muted,
    fontSize: 14,
    fontWeight: "500",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseMenu: {
    backgroundColor: Colors.background.dark,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.card.border,
    alignItems: "center",
    gap: 16,
    minWidth: 200,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    justifyContent: "center",
  },
  menuButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  menuButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  menuButtonTextSecondary: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
