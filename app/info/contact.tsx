import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Mail, Send } from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = useCallback(async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Error", "Please fill in all fields");
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
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us! We'll get back to you soon.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    }, 1500);
  }, [name, email, subject, message, router]);

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={28} color={Colors.text.primary} />
              </Pressable>
              <Text style={styles.headerTitle}>Contact Support</Text>
              <View style={styles.placeholder} />
            </View>

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.intro}>
                Have a question or feedback? We'd love to hear from you. Fill
                out the form below and we'll get back to you as soon as
                possible.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={Colors.text.muted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.text.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="How can we help?"
                    placeholderTextColor={Colors.text.muted}
                    value={subject}
                    onChangeText={setSubject}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder="Describe your issue or feedback..."
                    placeholderTextColor={Colors.text.muted}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleSubmit}
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
                      <>
                        <Send size={20} color={Colors.text.primary} />
                        <Text style={styles.buttonText}>Send Message</Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>

              <View style={styles.alternativeContact}>
                <Text style={styles.altTitle}>Other Ways to Reach Us</Text>
                <View style={styles.altItem}>
                  <Mail size={18} color={Colors.text.muted} />
                  <Text style={styles.altText}>support@dropsphere.app</Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
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
  content: {
    paddingHorizontal: 24,
  },
  intro: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.card.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  messageInput: {
    height: 140,
    paddingTop: 14,
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  alternativeContact: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.card.border,
  },
  altTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  altItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  altText: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
});
