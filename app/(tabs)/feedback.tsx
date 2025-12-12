import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { feedbackLoggingService, FeedbackEntry } from '@/services/feedbackLoggingService';

/**
 * FeedbackScreen - Allow users to rate and provide feedback
 */
function FeedbackScreen() {
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

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.star}
            onPress={() => handleStarPress(star)}
            disabled={isSubmitting}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={40}
              color={star <= rating ? '#f59e0b' : '#cbd5e1'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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

  const categories = [
    { key: 'general' as const, label: 'General', icon: 'comment' },
    { key: 'chat' as const, label: 'Chat AI', icon: 'comments' },
    { key: 'ui' as const, label: 'Interface', icon: 'mobile' },
    { key: 'performance' as const, label: 'Performance', icon: 'tachometer' },
    { key: 'feature_request' as const, label: 'Feature', icon: 'lightbulb-o' },
    { key: 'bug_report' as const, label: 'Bug Report', icon: 'bug' },
  ];

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <FontAwesome name="sign-in" size={60} color="#2563eb" />
          <Text style={styles.loginTitle}>Login Required</Text>
          <Text style={styles.loginText}>Please login to submit feedback</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome name="star" size={50} color="#f59e0b" />
          </View>
          <Text style={styles.title}>Share Your Feedback</Text>
          <Text style={styles.subtitle}>Help us improve CampusConnect AI</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
          {renderStars()}
          <Text style={styles.ratingDescription}>{getRatingDescription()}</Text>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  category === cat.key && styles.categoryButtonSelected
                ]}
                onPress={() => handleCategoryPress(cat.key)}
                disabled={isSubmitting}
              >
                <FontAwesome
                  name={cat.icon as any}
                  size={16}
                  color={category === cat.key ? '#2563eb' : '#64748b'}
                />
                <Text style={[
                  styles.categoryText,
                  category === cat.key && styles.categoryTextSelected
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Comments (Optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your thoughts, suggestions, or report issues..."
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            editable={!isSubmitting}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="paper-plane" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.infoText}>
            Your feedback helps us improve the app experience for all users.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1e293b',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 8,
    padding: 8,
  },
  ratingDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    minWidth: 100,
  },
  categoryButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
  },
  categoryTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
  },
  commentSection: {
    marginBottom: 30,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1e293b',
  },
  loginText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default FeedbackScreen;