import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";

export default function PrivacyScreen() {
  const router = useRouter();

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
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <ChevronLeft size={28} color={Colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.lastUpdated}>Last Updated: March 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.sectionText}>
              DropSphere ("we," "our," or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our mobile
              application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information that you provide directly to us, including:
              {"\n\n"}• Account information (name, email address){"\n"}• Game
              progress and achievements{"\n"}• Device information and app usage
              data{"\n"}• Preferences and settings
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              3. How We Use Your Information
            </Text>
            <Text style={styles.sectionText}>
              We use the information we collect to:
              {"\n\n"}• Provide and maintain our services{"\n"}• Track your game
              progress and achievements{"\n"}• Improve and personalize your
              experience{"\n"}• Send you updates and notifications{"\n"}•
              Respond to your comments and questions
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Storage</Text>
            <Text style={styles.sectionText}>
              Your game progress and settings are stored locally on your device
              using secure storage. Account information is stored on our secure
              servers. We use industry-standard security measures to protect
              your data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionText}>
              You have the right to:
              {"\n\n"}• Access your personal information{"\n"}• Request
              correction of your data{"\n"}• Request deletion of your account
              {"\n"}• Opt-out of marketing communications
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about this Privacy Policy, please
              contact us through the Contact Support section in the app
              settings.
            </Text>
          </View>
        </ScrollView>
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
  lastUpdated: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
});
