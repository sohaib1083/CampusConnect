import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  View, 
  Text, 
  Dimensions, 
  Animated,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Theme } from '@/constants/Theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Stunning LandingScreen - An awe-inspiring first impression
 * Modern design with animations and gradients
 */
export default function LandingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous logo rotation
    const startRotation = () => {
      Animated.loop(
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    };
    
    const timer = setTimeout(startRotation, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={[
          Theme.colors.secondary,
          Theme.colors.primary,
          Theme.colors.secondaryLight,
          '#E8F4FD'
        ]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingElements}>
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section */}
          <Animated.View style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}>
            {/* Animated Logo */}
            <View style={styles.logoContainer}>
              <Animated.View style={{
                transform: [{ rotate: logoRotate }]
              }}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="school" size={80} color={Theme.colors.textInverse} />
                </LinearGradient>
              </Animated.View>
              
              {/* Pulsing Ring */}
              <View style={styles.logoRing} />
            </View>

            {/* Hero Text */}
            <Text style={styles.heroTitle}>Campus
              Connect</Text>
            <Text style={styles.heroSubtitle}>
              Your AI-Powered University Companion
            </Text>
            <Text style={styles.heroDescription}>
              Experience the future of campus life with intelligent assistance, 
              real-time updates, and seamless connectivity.
            </Text>
          </Animated.View>

          {/* Features Showcase */}
          <Animated.View style={[
            styles.featuresSection,
            { opacity: fadeAnim }
          ]}>
            <Text style={styles.sectionTitle}>Why Students Love Us</Text>
            
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                  style={styles.featureCardGradient}
                >
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="chatbubble-ellipses" size={32} color={Theme.colors.secondary} />
                  </View>
                  <Text style={styles.featureTitle}>Smart AI Chat</Text>
                  <Text style={styles.featureDescription}>
                    Get instant answers to academic questions 24/7
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                  style={styles.featureCardGradient}
                >
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="calendar" size={32} color="#10b981" />
                  </View>
                  <Text style={styles.featureTitle}>Event Updates</Text>
                  <Text style={styles.featureDescription}>
                    Never miss important deadlines and events
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                  style={styles.featureCardGradient}
                >
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="people" size={32} color="#f59e0b" />
                  </View>
                  <Text style={styles.featureTitle}>Connect & Share</Text>
                  <Text style={styles.featureDescription}>
                    Build meaningful connections with peers
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.featureCard}>
                <LinearGradient
                  colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
                  style={styles.featureCardGradient}
                >
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="analytics" size={32} color="#ef4444" />
                  </View>
                  <Text style={styles.featureTitle}>Academic Insights</Text>
                  <Text style={styles.featureDescription}>
                    Track progress and get personalized tips
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </Animated.View>

          {/* Call to Action Section */}
          <Animated.View style={[
            styles.ctaSection,
            { opacity: fadeAnim }
          ]}>
            <View style={styles.ctaCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.ctaCardGradient}
              >
                <Text style={styles.ctaTitle}>Ready to Transform Your Campus Experience?</Text>
                <Text style={styles.ctaDescription}>
                  Join thousands of students already using CampusConnect
                </Text>

                {/* Primary CTA Button */}
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Theme.colors.secondary, Theme.colors.primary]}
                    style={styles.primaryButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.primaryButtonText}>Get Started Now</Text>
                    <Ionicons name="arrow-forward" size={24} color={Theme.colors.textInverse} />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Secondary CTA Button */}
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Create Account</Text>
                  <Ionicons name="person-add" size={20} color={Theme.colors.secondary} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Active Students</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Universities</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>AI Support</Text>
              </View>
            </View>
            
            <View style={styles.footerTrust}>
              <Ionicons name="shield-checkmark" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={styles.footerTrustText}>
                Secure • Reliable • Student-First
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElements: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    top: 0,
    left: 0,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: Theme.colors.textInverse,
    top: '10%',
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: Theme.colors.textInverse,
    bottom: '30%',
    left: -75,
  },
  circle3: {
    width: 120,
    height: 120,
    backgroundColor: Theme.colors.textInverse,
    top: '50%',
    right: '20%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Theme.spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    minHeight: screenHeight * 0.75,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    position: 'relative',
  },
  logoGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.xl,
  },
  logoRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    top: -15,
    left: -15,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Theme.colors.textInverse,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    // React Native compatible shadow
    ...(Platform.OS === 'web' ? {
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    } : {
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    }),
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: 28,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Theme.spacing.lg,
    maxWidth: 340,
  },
  featuresSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.textInverse,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    // React Native compatible shadow
    ...(Platform.OS === 'web' ? {
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    } : {
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    }),
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Theme.spacing.md,
  },
  featureCard: {
    width: (screenWidth - Theme.spacing.lg * 2 - Theme.spacing.md) / 2,
    marginBottom: Theme.spacing.md,
  },
  featureCardGradient: {
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.xl,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIconContainer: {
    marginBottom: Theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textInverse,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  ctaCard: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    ...Theme.shadows.xl,
  },
  ctaCardGradient: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    lineHeight: 32,
  },
  ctaDescription: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: 24,
  },
  primaryButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.lg,
    width: '100%',
    ...Theme.shadows.lg,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.textInverse,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: Theme.colors.secondary,
    backgroundColor: 'transparent',
    gap: Theme.spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.secondary,
  },
  footer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    alignItems: 'center',
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Theme.spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.textInverse,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  footerTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  footerTrustText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
