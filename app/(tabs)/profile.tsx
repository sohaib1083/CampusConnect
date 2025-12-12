import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { chatLoggingService } from '@/services/chatLoggingService';
import { feedbackLoggingService } from '@/services/feedbackLoggingService';

function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
              router.replace('/');
            } catch (error: any) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
  };

  const handleChatHistory = async () => {
    if (!user) return;
    
    try {
      const messages = await chatLoggingService.getUserChatHistory(user.uid, 10);
      Alert.alert(
        'Chat History',
        `You have ${messages.length} recent chat messages.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load chat history.');
    }
  };

  const handleFeedbackHistory = async () => {
    if (!user) return;
    
    try {
      const feedback = await feedbackLoggingService.getUserFeedback(user.uid);
      Alert.alert(
        'Feedback History',
        `You have submitted ${feedback.length} feedback entries.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load feedback history.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please login to view your profile</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <FontAwesome name="user-circle" size={80} color="#2563eb" />
          )}
        </View>
        <Text style={styles.name}>{user.displayName || 'Student'}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.studentId && <Text style={styles.id}>ID: {user.studentId}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <FontAwesome name="user" size={20} color="#666" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleChatHistory}>
          <FontAwesome name="history" size={20} color="#666" />
          <Text style={styles.menuText}>Chat History</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleFeedbackHistory}>
          <FontAwesome name="star" size={20} color="#666" />
          <Text style={styles.menuText}>My Feedback</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="bell" size={20} color="#666" />
          <Text style={styles.menuText}>Notifications</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="paint-brush" size={20} color="#666" />
          <Text style={styles.menuText}>Appearance</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="language" size={20} color="#666" />
          <Text style={styles.menuText}>Language</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="question-circle" size={20} color="#666" />
          <Text style={styles.menuText}>Help Center</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="info-circle" size={20} color="#666" />
          <Text style={styles.menuText}>About</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="shield" size={20} color="#666" />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, isLoading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#e74c3c" />
        ) : (
          <>
            <FontAwesome name="sign-out" size={20} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 3,
  },
  id: {
    fontSize: 12,
    opacity: 0.5,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    backgroundColor: '#fee',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  version: {
    fontSize: 12,
    opacity: 0.4,
  },
});

export default ProfileScreen;
