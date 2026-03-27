import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Mail, CheckCircle } from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

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

  const handleReset = useCallback(async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  }, [email]);

  const goBack = useCallback(() => {
    router.back();
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

            {!isSent ? (
              <>
                {/* Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.subtitle}>
                    Enter your email address and we'll send you instructions to
                    reset your password.
                  </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
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

                  <Pressable
                    style={({ pressed }) => [
                      styles.resetButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleReset}
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
                        <Text style={styles.buttonText}>Send Instructions</Text>
                      )}
                    </LinearGradient>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <CheckCircle size={80} color={Colors.success} />
                </View>
                <Text style={styles.successTitle}>Check Your Email</Text>
                <Text style={styles.successMessage}>
                  We've sent password reset instructions to {email}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.backToLogin,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={goBack}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </Pressable>
              </View>
            )}
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
    lineHeight: 24,
  },
  form: {
    gap: 24,
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
  resetButton: {
    borderRadius: 16,
    overflow: "hidden",
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
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  backToLogin: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  backToLoginText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
