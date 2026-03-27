import DropSphereLogo from "@/components/DropSphereLogo";
import { Colors, Gradients } from "@/constants/colors";
import { useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  FileText,
  Globe,
  HelpCircle,
  LogOut,
  MessageCircle,
  Music,
  RotateCcw,
  Shield,
  Vibrate,
  Volume2,
} from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
}

function SettingItem({
  icon,
  title,
  value,
  onValueChange,
  onPress,
  showArrow,
}: SettingItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.itemPressed,
      ]}
      onPress={onPress}
      disabled={!onPress && !onValueChange}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
      {onValueChange !== undefined && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#767577", true: Colors.primary }}
          thumbColor={value ? Colors.text.primary : "#f4f3f4"}
        />
      )}
      {showArrow && (
        <ChevronLeft
          size={20}
          color={Colors.text.muted}
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { resetProgress, logout } = useGame();
  const {
    soundEnabled,
    musicEnabled,
    vibrationEnabled,
    language,
    setSoundEnabled,
    setMusicEnabled,
    setVibrationEnabled,
    setLanguage,
  } = useSettings();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
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

  const confirmResetProgress = useCallback(() => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all progress? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            Alert.alert("Success", "Your progress has been reset.");
          },
        },
      ],
    );
  }, [resetProgress]);

  const confirmLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
  }, [logout, router]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path as `/auth/login`);
    },
    [router],
  );

  const cycleLanguage = useCallback(() => {
    const languages = ["en", "es", "fr", "de", "ur"];
    const currentIndex = languages.indexOf(language);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % languages.length : 0;
    setLanguage(languages[nextIndex]);
  }, [language, setLanguage]);

  const formatLanguage = useCallback((code: string) => {
    switch (code) {
      case "en":
        return "English";
      case "es":
        return "Spanish";
      case "fr":
        return "French";
      case "de":
        return "German";
      case "ur":
        return "Urdu";
      default:
        return code.toUpperCase();
    }
  }, []);

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
              <ChevronLeft size={28} color={Colors.text.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Audio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Audio</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon={<Volume2 size={22} color={Colors.text.primary} />}
                  title="Sound Effects"
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                />
                <SettingItem
                  icon={<Music size={22} color={Colors.text.primary} />}
                  title="Game Tune"
                  value={musicEnabled}
                  onValueChange={setMusicEnabled}
                />
              </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon={<Vibrate size={22} color={Colors.text.primary} />}
                  title="Vibration"
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                />
                <SettingItem
                  icon={<Globe size={22} color={Colors.text.primary} />}
                  title={`Language (${formatLanguage(language)})`}
                  showArrow
                  onPress={cycleLanguage}
                />
              </View>
            </View>

            {/* Game Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon={<RotateCcw size={22} color={Colors.danger} />}
                  title="Reset Progress"
                  showArrow
                  onPress={confirmResetProgress}
                />
              </View>
            </View>

            {/* Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon={<Shield size={22} color={Colors.text.primary} />}
                  title="Privacy Policy"
                  showArrow
                  onPress={() => navigateTo("/info/privacy")}
                />
                <SettingItem
                  icon={<FileText size={22} color={Colors.text.primary} />}
                  title="Terms & Conditions"
                  showArrow
                  onPress={() => navigateTo("/info/terms")}
                />
                <SettingItem
                  icon={<HelpCircle size={22} color={Colors.text.primary} />}
                  title="FAQs"
                  showArrow
                  onPress={() => navigateTo("/info/faq")}
                />
                <SettingItem
                  icon={<MessageCircle size={22} color={Colors.text.primary} />}
                  title="Contact Support"
                  showArrow
                  onPress={() => navigateTo("/info/contact")}
                />
              </View>
            </View>

            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.sectionContent}>
                <SettingItem
                  icon={<LogOut size={22} color={Colors.danger} />}
                  title="Logout"
                  showArrow
                  onPress={confirmLogout}
                />
              </View>
            </View>

            {/* Branding */}
            <View style={styles.brandingFooter}>
              <DropSphereLogo width={190} />
              <Text style={styles.version}>v1.0.0</Text>
            </View>
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
    paddingHorizontal: 24,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.muted,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  itemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  brandingFooter: {
    alignItems: "center",
    marginTop: 8,
  },
  version: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.text.muted,
  },
});
