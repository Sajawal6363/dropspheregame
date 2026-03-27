import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { Colors, Gradients } from "@/constants/colors";

const faqs = [
  {
    question: "How do I play DropSphere?",
    answer:
      "Swipe left or right to control the ball's movement. Guide the ball down through the platforms without falling off. Reach the bottom platform (marked 'GOAL') to complete the level.",
  },
  {
    question: "Why did I lose the level?",
    answer:
      "You lose if the ball falls off the platforms or hits a trap platform (pink colored). Pay attention to moving platforms and gaps as you progress through harder levels.",
  },
  {
    question: "How many levels are there?",
    answer:
      "DropSphere features 50 unique levels across 5 difficulty stages: Easy (1-10), Medium (11-20), Hard (21-30), Very Hard (31-40), and Extreme (41-50).",
  },
  {
    question: "How do I unlock new levels?",
    answer:
      "Complete a level to unlock the next one. You can also replay any previously unlocked level from the Level Select screen.",
  },
  {
    question: "What are the different platform colors?",
    answer:
      "Purple platforms are static. Blue platforms move horizontally. Pink platforms are traps that end your run. The green 'GOAL' platform completes the level.",
  },
  {
    question: "How is my progress saved?",
    answer:
      "Your progress is automatically saved to your device. If you create an account, your progress is also synced to our servers so you can continue on other devices.",
  },
  {
    question: "Can I reset my progress?",
    answer:
      "Yes! Go to Settings > Game > Reset Progress. Please note this action cannot be undone and will clear all your completed levels.",
  },
  {
    question: "The game is too hard. Any tips?",
    answer:
      "Start with small, gentle swipes to control the ball. Watch the moving platforms' patterns before jumping. Take your time - there's no time limit! Practice makes perfect.",
  },
];

export default function FAQScreen() {
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
          <Text style={styles.headerTitle}>FAQs</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.intro}>
            Find answers to commonly asked questions about DropSphere.
          </Text>

          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <View style={styles.questionContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Q</Text>
                </View>
                <Text style={styles.question}>{faq.question}</Text>
              </View>
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{faq.answer}</Text>
              </View>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactText}>
              Can't find what you're looking for?
            </Text>
            <Pressable
              style={styles.contactButton}
              onPress={() => router.push("/info/contact")}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </Pressable>
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
  intro: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  faqItem: {
    marginBottom: 24,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  question: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
    lineHeight: 24,
  },
  answerContainer: {
    marginLeft: 40,
    backgroundColor: Colors.card.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  answer: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  contactSection: {
    alignItems: "center",
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.card.border,
  },
  contactText: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
