import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

/**
 * HomeScreen - Landing page for CampusConnect AI
 * Shows app introduction and navigation to chat
 */
export default function HomeScreen() {
  const handleStartChat = () => {
    router.push('/(tabs)/chat');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome name="graduation-cap" size={80} color="#2563eb" />
        </View>
        <Text style={styles.title}>CampusConnect AI</Text>
        <Text style={styles.tagline}>Your Personal Student Assistant</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What I Can Help With</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <FontAwesome name="book" size={24} color="#2563eb" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Academic Rules</Text>
              <Text style={styles.featureDescription}>
                Get answers about course requirements, grading policies, and academic regulations
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <FontAwesome name="calendar" size={24} color="#2563eb" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Important Dates</Text>
              <Text style={styles.featureDescription}>
                Registration deadlines, exam schedules, and academic calendar
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <FontAwesome name="calculator" size={24} color="#2563eb" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>CGPA & Grades</Text>
              <Text style={styles.featureDescription}>
                Understand CGPA calculation, grade policies, and academic standing
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <FontAwesome name="question-circle" size={24} color="#2563eb" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>General Guidance</Text>
              <Text style={styles.featureDescription}>
                Campus facilities, student services, and university procedures
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartChat}>
          <FontAwesome name="comments" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.startButtonText}>Start Chat</Text>
          <FontAwesome name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by Groq AI • Available 24/7
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  tagline: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1e293b',
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    paddingTop: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1e293b',
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
