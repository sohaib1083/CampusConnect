import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

/**
 * FeedbackScreen - Allow users to rate and provide feedback
 * Includes star rating, text comments, and submit functionality
 */
export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle star rating selection
   */
  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  /**
   * Handle feedback submission
   */
  const handleSubmit = async () => {
    // Validate rating
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    // Validate comment (optional but recommended)
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

  /**
   * Submit feedback to backend
   */
  const submitFeedback = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Integrate with Firebase or your backend API
      // await submitFeedbackToBackend({ rating, comment });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Feedback submitted:', { rating, comment, timestamp: new Date() });

      Alert.alert(
        'Thank You! 🎉',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setRating(0);
              setComment('');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Feedback submission error:', error);
      Alert.alert(
        'Submission Failed',
        'Unable to submit feedback. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Render star rating component
   */
  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}
            disabled={isSubmitting}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={44}
              color={star <= rating ? '#f59e0b' : '#cbd5e1'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  /**
   * Get rating text based on selected stars
   */
  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Tap a star to rate';
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome name="comment" size={50} color="#2563eb" />
          </View>
          <Text style={styles.title}>How was your experience?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us improve CampusConnect AI
          </Text>
        </View>

        <View style={styles.ratingSection}>
          {renderStars()}
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.label}>Comments (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tell us more about your experience..."
            placeholderTextColor="#94a3b8"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <FontAwesome name="paper-plane" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <FontAwesome name="info-circle" size={16} color="#2563eb" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Your feedback is anonymous and will be used to enhance the app experience.
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
    marginBottom: 40,
    marginTop: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
  },
  commentSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 140,
    color: '#1e293b',
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },
});
