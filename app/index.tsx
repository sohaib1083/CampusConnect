import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

/**
 * LandingScreen - First screen users see
 * Shows app introduction and navigates to login
 */
export default function LandingScreen() {
  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome name="graduation-cap" size={100} color="#2563eb" />
        </View>
        <Text style={styles.title}>CampusConnect AI</Text>
        <Text style={styles.tagline}>Your 24/7 University Assistant</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Get instant answers to all your university questions powered by advanced AI technology.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Academic Rules & Policies</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Registration & Deadlines</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>Exam Information</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>CGPA Calculation</Text>
          </View>

          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={24} color="#10b981" />
            <Text style={styles.featureText}>General Guidance</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
          <FontAwesome name="arrow-right" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <FontAwesome name="shield" size={16} color="#64748b" style={styles.footerIcon} />
          <Text style={styles.footerText}>
            Secure • Fast • Available 24/7
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
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 40,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 20,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
    color: '#1e293b',
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 12,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
});
