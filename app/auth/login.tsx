import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { Theme } from '@/constants/Theme';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Modern LoginScreen - Beautiful gradient design with smooth animations
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please fill in all fields to continue');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/main');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primary, Theme.colors.secondary, Theme.colors.primaryLight]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Modern Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="school" size={50} color={Theme.colors.textInverse} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>CampusConnect</Text>
              <Text style={styles.subtitle}>Your AI-powered campus companion</Text>
            </View>

            {/* Modern Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to continue your campus journey</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="mail" size={20} color={Theme.colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="lock-closed" size={20} color={Theme.colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color={Theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
                onPress={handleEmailLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Theme.colors.primary, Theme.colors.secondary]}
                  style={styles.signInGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Theme.colors.textInverse} size="small" />
                  ) : (
                    <>
                      <Text style={styles.signInButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color={Theme.colors.textInverse} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl * 2,
    paddingTop: Theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: Theme.spacing.lg,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.lg,
  },
  title: {
    fontSize: Theme.typography.h1.fontSize,
    fontWeight: Theme.typography.h1.fontWeight,
    color: Theme.colors.textInverse,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.typography.body1.fontSize,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: Theme.typography.body1.lineHeight,
  },
  formCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    ...Theme.shadows.lg,
    marginBottom: Theme.spacing.xl,
  },
  formHeader: {
    marginBottom: Theme.spacing.xl,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  formSubtitle: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.typography.body2.lineHeight,
  },
  inputGroup: {
    marginBottom: Theme.spacing.lg,
  },
  inputLabel: {
    fontSize: Theme.typography.body2.fontSize,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
  },
  inputIconContainer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.primaryLight + '20',
  },
  input: {
    flex: 1,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.body1.fontSize,
    color: Theme.colors.text,
  },
  passwordToggle: {
    padding: Theme.spacing.md,
  },
  signInButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  signInButtonText: {
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: '600',
    color: Theme.colors.textInverse,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Theme.spacing.md,
  },
  signUpText: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.textSecondary,
  },
  signUpLink: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});