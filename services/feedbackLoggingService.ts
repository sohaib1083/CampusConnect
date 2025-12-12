import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export interface FeedbackEntry {
  id?: string;
  userId: string;
  rating: number; // 1-5 stars
  comment: string;
  category: 'general' | 'chat' | 'ui' | 'performance' | 'feature_request' | 'bug_report';
  timestamp: Date;
  status: 'new' | 'reviewed' | 'addressed' | 'closed';
  adminResponse?: string;
  adminResponseAt?: Date;
  metadata?: {
    appVersion?: string;
    deviceInfo?: string;
    chatMessageId?: string; // If feedback is about a specific chat interaction
    userAgent?: string;
  };
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  categoryBreakdown: { [key: string]: number };
  recentFeedback: FeedbackEntry[];
}

class FeedbackLoggingService {
  private readonly FEEDBACK_COLLECTION = 'feedback';

  /**
   * Submit user feedback
   */
  async submitFeedback(
    userId: string,
    rating: number,
    comment: string,
    category: FeedbackEntry['category'],
    metadata?: FeedbackEntry['metadata']
  ): Promise<string> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const feedbackData = {
        userId,
        rating,
        comment: comment.trim(),
        category,
        timestamp: serverTimestamp(),
        status: 'new' as const,
        metadata: metadata || null,
      };

      const docRef = await addDoc(collection(db, this.FEEDBACK_COLLECTION), feedbackData);
      
      console.log('Feedback submitted successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Get user's feedback history
   */
  async getUserFeedback(userId: string): Promise<FeedbackEntry[]> {
    try {
      const q = query(
        collection(db, this.FEEDBACK_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const feedback: FeedbackEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedback.push({
          id: doc.id,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          category: data.category,
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status,
          adminResponse: data.adminResponse,
          adminResponseAt: data.adminResponseAt?.toDate(),
          metadata: data.metadata,
        });
      });

      return feedback;
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  }

  /**
   * Get all feedback (for admin use)
   */
  async getAllFeedback(limit?: number): Promise<FeedbackEntry[]> {
    try {
      let q = query(
        collection(db, this.FEEDBACK_COLLECTION),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const feedback: FeedbackEntry[] = [];
      let count = 0;

      querySnapshot.forEach((doc) => {
        if (limit && count >= limit) return;
        
        const data = doc.data();
        feedback.push({
          id: doc.id,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          category: data.category,
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status,
          adminResponse: data.adminResponse,
          adminResponseAt: data.adminResponseAt?.toDate(),
          metadata: data.metadata,
        });
        
        count++;
      });

      return feedback;
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  }

  /**
   * Get feedback by category
   */
  async getFeedbackByCategory(category: FeedbackEntry['category']): Promise<FeedbackEntry[]> {
    try {
      const q = query(
        collection(db, this.FEEDBACK_COLLECTION),
        where('category', '==', category),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const feedback: FeedbackEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        feedback.push({
          id: doc.id,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          category: data.category,
          timestamp: data.timestamp?.toDate() || new Date(),
          status: data.status,
          adminResponse: data.adminResponse,
          adminResponseAt: data.adminResponseAt?.toDate(),
          metadata: data.metadata,
        });
      });

      return feedback;
    } catch (error) {
      console.error('Error fetching feedback by category:', error);
      throw error;
    }
  }

  /**
   * Update feedback status (admin use)
   */
  async updateFeedbackStatus(
    feedbackId: string,
    status: FeedbackEntry['status'],
    adminResponse?: string
  ): Promise<void> {
    try {
      const feedbackRef = doc(db, this.FEEDBACK_COLLECTION, feedbackId);
      const updateData: any = {
        status,
      };

      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.adminResponseAt = serverTimestamp();
      }

      await updateDoc(feedbackRef, updateData);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<FeedbackStats> {
    try {
      const allFeedback = await this.getAllFeedback();
      
      // Calculate statistics
      const totalFeedback = allFeedback.length;
      const averageRating = totalFeedback > 0 
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback 
        : 0;
      
      // Rating distribution
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      allFeedback.forEach(f => {
        ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1;
      });

      // Category breakdown
      const categoryBreakdown: { [key: string]: number } = {};
      allFeedback.forEach(f => {
        categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
      });

      // Recent feedback (last 10)
      const recentFeedback = allFeedback.slice(0, 10);

      return {
        totalFeedback,
        averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        ratingDistribution,
        categoryBreakdown,
        recentFeedback,
      };
    } catch (error) {
      console.error('Error getting feedback stats:', error);
      throw error;
    }
  }

  /**
   * Get feedback for a specific chat message
   */
  async getChatMessageFeedback(chatMessageId: string): Promise<FeedbackEntry[]> {
    try {
      const allFeedback = await this.getAllFeedback();
      return allFeedback.filter(f => f.metadata?.chatMessageId === chatMessageId);
    } catch (error) {
      console.error('Error getting chat message feedback:', error);
      throw error;
    }
  }

  /**
   * Check if user has submitted feedback recently (within last 24 hours)
   */
  async hasRecentFeedback(userId: string): Promise<boolean> {
    try {
      const userFeedback = await this.getUserFeedback(userId);
      
      if (userFeedback.length === 0) return false;
      
      const latestFeedback = userFeedback[0];
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      return latestFeedback.timestamp > twentyFourHoursAgo;
    } catch (error) {
      console.error('Error checking recent feedback:', error);
      return false;
    }
  }
}

export const feedbackLoggingService = new FeedbackLoggingService();