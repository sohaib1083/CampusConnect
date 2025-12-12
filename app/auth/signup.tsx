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
import { isValidEmail, isValidPassword } from '@/utils/validation';
import { Theme } from '@/constants/Theme';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Modern SignUpScreen - Beautiful gradient design matching login page
 */
export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup } = useAuth();

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      Alert.alert('Invalid Password', passwordValidation.errors.join('\n'));
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, displayName, studentId);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/main') }
      ]);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.secondary, Theme.colors.primary, Theme.colors.secondaryLight]}
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
                  <Ionicons name="person-add" size={50} color={Theme.colors.textInverse} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Join CampusConnect</Text>
              <Text style={styles.subtitle}>Create your account and start exploring</Text>
            </View>

            {/* Modern Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Create Account</Text>
                <Text style={styles.formSubtitle}>Fill in your details to get started</Text>
              </View>

              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="person" size={20} color={Theme.colors.secondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoComplete="name"
                  />
                </View>
              </View>

              {/* Student ID Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Student ID (Optional)</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="id-card" size={20} color={Theme.colors.secondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your student ID"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={studentId}
                    onChangeText={setStudentId}
                    autoComplete="off"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="mail" size={20} color={Theme.colors.secondary} />
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
                    <Ionicons name="lock-closed" size={20} color={Theme.colors.secondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
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

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="lock-closed" size={20} color={Theme.colors.secondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={Theme.colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color={Theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
                onPress={handleSignUp}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Theme.colors.secondary, Theme.colors.primary]}
                  style={styles.signUpGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Theme.colors.textInverse} size="small" />
                  ) : (
                    <>
                      <Text style={styles.signUpButtonText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={20} color={Theme.colors.textInverse} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
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
    paddingVertical: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    paddingTop: Theme.spacing.lg,
  },
  logoContainer: {
    marginBottom: Theme.spacing.lg,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.lg,
  },
  title: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
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
    marginBottom: Theme.spacing.lg,
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
    marginBottom: Theme.spacing.md,
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
    backgroundColor: Theme.colors.secondaryLight + '20',
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
  signUpButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  signUpButtonText: {
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: '600',
    color: Theme.colors.textInverse,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Theme.spacing.md,
  },
  loginText: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.secondary,
    fontWeight: '600',
  },
});