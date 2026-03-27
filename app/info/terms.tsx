import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";

export default function TermsScreen() {
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
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.lastUpdated}>Last Updated: March 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By downloading, installing, or using DropSphere ("the App"), you
              agree to be bound by these Terms and Conditions. If you do not
              agree to these terms, please do not use the App.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. License</Text>
            <Text style={styles.sectionText}>
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to use the App for your personal, non-commercial purposes.
              You may not:
              {"\n\n"}• Copy, modify, or distribute the App{"\n"}• Reverse
              engineer or attempt to extract the source code{"\n"}• Use the App
              for any illegal purpose{"\n"}• Sell, rent, or lease the App
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.sectionText}>
              To access certain features of the App, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Game Content</Text>
            <Text style={styles.sectionText}>
              All game content, including but not limited to graphics, sounds,
              music, and game mechanics, are the property of DropSphere and are
              protected by copyright and other intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              To the maximum extent permitted by law, DropSphere shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or relating to your use of the
              App.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will
              notify you of any material changes by posting the new terms on
              this page. Your continued use of the App after any changes
              constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Contact</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms, please contact us
              through the Contact Support section in the app settings.
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
