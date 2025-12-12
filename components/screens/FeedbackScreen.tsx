import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { feedbackLoggingService, FeedbackEntry } from '@/services/feedbackLoggingService';
import { Theme } from '@/constants/Theme';

interface FeedbackScreenProps {}

interface StarRatingProps {
  rating: number;
  onRatingPress: (rating: number) => void;
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingPress, disabled = false }) => {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          style={styles.star}
          onPress={() => onRatingPress(star)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={40}
            color={star <= rating ? Theme.colors.warning : Theme.colors.border}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface CategoryButtonProps {
  category: {
    key: FeedbackEntry['category'];
    label: string;
    icon: string;
  };
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, selected, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.categoryButton, selected && styles.categoryButtonSelected]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons
        name={category.icon as any}
        size={18}
        color={selected ? Theme.colors.primary : Theme.colors.textSecondary}
      />
      <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
};

const categories = [
  { key: 'general' as const, label: 'General', icon: 'chatbox' },
  { key: 'chat' as const, label: 'AI Chat', icon: 'chatbubbles' },
  { key: 'ui' as const, label: 'Interface', icon: 'phone-portrait' },
  { key: 'performance' as const, label: 'Performance', icon: 'speedometer' },
  { key: 'feature_request' as const, label: 'Feature', icon: 'bulb' },
  { key: 'bug_report' as const, label: 'Bug Report', icon: 'bug' },
];

/**
 * Modern FeedbackScreen - Beautiful feedback submission interface
 * Includes star rating, category selection, and comment input
 */
const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<FeedbackEntry['category']>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleCategoryPress = (selectedCategory: FeedbackEntry['category']) => {
    setCategory(selectedCategory);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Please Login', 'You need to be logged in to submit feedback.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    if (comment.trim().length === 0) {
      Alert.alert(
        'Add Comments?',
        'Would you like to add comments to help us improve?',
        [
          { text: 'Skip', onPress: () => submitFeedback() },
          { text: 'Add Comments', style: 'cancel' }
        ]
      );
      return;
    }

    await submitFeedback();
  };

  const submitFeedback = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      await feedbackLoggingService.submitFeedback(
        user.uid,
        rating,
        comment.trim(),
        category,
        {
          appVersion: '1.0.0',
          userAgent: 'CampusConnect Mobile App',
        }
      );

      Alert.alert(
        'Thank You! 🎉',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setRating(0);
              setComment('');
              setCategory('general');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Feedback submission error:', error);
      Alert.alert(
        'Submission Failed',
        'There was an error submitting your feedback. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescription = () => {
    switch (rating) {
      case 1: return 'Poor 😞';
      case 2: return 'Fair 😐';
      case 3: return 'Good 😊';
      case 4: return 'Very Good 😄';
      case 5: return 'Excellent 🤩';
      default: return 'Tap a star to rate';
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <View style={styles.loginIconContainer}>
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.secondary] as [string, string]}
              style={styles.loginIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="lock-closed" size={40} color={Theme.colors.textInverse} />
            </LinearGradient>
          </View>
          <Text style={styles.loginTitle}>Login Required</Text>
          <Text style={styles.loginText}>
            Please sign in to your account to submit feedback and help us improve your experience
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.feedbackIconContainer}>
              <LinearGradient
                colors={[Theme.colors.warning, '#fbb040'] as [string, string]}
                style={styles.feedbackIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="star" size={32} color={Theme.colors.textInverse} />
              </LinearGradient>
            </View>
            <Text style={styles.welcomeTitle}>How was your experience?</Text>
            <Text style={styles.welcomeSubtitle}>
              Your feedback helps us improve CampusConnect for everyone
            </Text>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingCard}>
            <Text style={styles.cardTitle}>Rate Your Experience</Text>
            <StarRating 
              rating={rating} 
              onRatingPress={handleStarPress} 
              disabled={isSubmitting}
            />
            <Text style={styles.ratingDescription}>{getRatingDescription()}</Text>
          </View>

          {/* Category Section */}
          <View style={styles.categoryCard}>
            <Text style={styles.cardTitle}>What would you like to feedback on?</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <CategoryButton
                  key={cat.key}
                  category={cat}
                  selected={category === cat.key}
                  onPress={() => handleCategoryPress(cat.key)}
                  disabled={isSubmitting}
                />
              ))}
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.commentCard}>
            <Text style={styles.cardTitle}>Tell us more (Optional)</Text>
            <Text style={styles.cardSubtitle}>
              Share your thoughts, suggestions, or report any issues
            </Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Type your feedback here..."
              placeholderTextColor={Theme.colors.textSecondary}
              multiline
              numberOfLines={6}
              value={comment}
              onChangeText={setComment}
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isSubmitting ? 
                [Theme.colors.textSecondary, Theme.colors.textSecondary] :
                [Theme.colors.success, '#68d391'] as [string, string]
              }
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Theme.colors.textInverse} size="small" />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={20} color={Theme.colors.textInverse} />
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Info Footer */}
          <View style={styles.infoFooter}>
            <Ionicons name="shield-checkmark" size={20} color={Theme.colors.textSecondary} />
            <Text style={styles.infoText}>
              Your feedback is important to us and helps improve the app for all users.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: 45,
    paddingBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: Theme.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    color: Theme.colors.textInverse,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Theme.typography.caption.fontSize,
    fontWeight: Theme.typography.caption.fontWeight,
    color: Theme.colors.textInverse,
    opacity: 0.9,
  },
  placeholderContainer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  feedbackIconContainer: {
    marginBottom: Theme.spacing.md,
  },
  feedbackIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.lg,
  },
  welcomeTitle: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: Theme.typography.h4.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.typography.body2.lineHeight,
  },
  ratingCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  categoryCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  commentCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  cardTitle: {
    fontSize: Theme.typography.h6.fontSize,
    fontWeight: Theme.typography.h6.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: Theme.typography.body3.fontSize,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
    lineHeight: Theme.typography.body3.lineHeight,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  star: {
    marginHorizontal: Theme.spacing.sm,
    padding: Theme.spacing.sm,
  },
  ratingDescription: {
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: Theme.typography.body1.fontWeight,
    color: Theme.colors.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
    marginBottom: Theme.spacing.sm,
    width: '48%',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  categoryText: {
    marginLeft: Theme.spacing.xs,
    fontSize: Theme.typography.body3.fontSize,
    color: Theme.colors.textSecondary,
  },
  categoryTextSelected: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.body3.fontWeight,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    fontSize: Theme.typography.body1.fontSize,
    textAlignVertical: 'top',
    minHeight: 120,
    backgroundColor: Theme.colors.background,
    color: Theme.colors.text,
  },
  submitButton: {
    marginBottom: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  submitButtonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: Theme.typography.body1.fontWeight,
    marginLeft: Theme.spacing.sm,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  infoText: {
    fontSize: Theme.typography.body3.fontSize,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.sm,
    flex: 1,
    lineHeight: Theme.typography.body3.lineHeight,
  },
  bottomSpacing: {
    height: Theme.spacing.xl,
  },
  // Login prompt styles
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  loginIconContainer: {
    marginBottom: Theme.spacing.xl,
  },
  loginIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.lg,
  },
  loginTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  loginText: {
    fontSize: Theme.typography.body1.fontSize,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: Theme.typography.body1.lineHeight,
  },
});

export default FeedbackScreen;