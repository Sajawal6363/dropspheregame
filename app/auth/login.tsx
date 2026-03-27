import DropSphereLogo from "@/components/DropSphereLogo";
import { Colors, Gradients } from "@/constants/colors";
import { useGame } from "@/context/GameContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useGame();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = useCallback(async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login({
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email,
      });
      router.replace("/home");
    }, 1500);
  }, [email, password, login, router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goToSignup = useCallback(() => {
    router.push("/auth/signup");
  }, [router]);

  const goToForgotPassword = useCallback(() => {
    router.push("/auth/forgot-password");
  }, [router]);

  return (
    <LinearGradient
      colors={Gradients.background}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
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
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <DropSphereLogo width={200} />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your journey
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.text.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.text.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.text.muted} />
                  ) : (
                    <Eye size={20} color={Colors.text.muted} />
                  )}
                </Pressable>
              </View>

              <Pressable onPress={goToForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={Gradients.primary}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.text.primary} />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={goToSignup}>
                <Text style={styles.signupText}>Sign Up</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
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
  titleContainer: {
    marginTop: 32,
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    gap: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.card.border,
    gap: 12,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: 16,
    height: "100%",
  },
  forgotText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  loginButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
    marginBottom: 24,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  signupText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "700",
  },
});
