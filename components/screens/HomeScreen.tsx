import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';

interface HomeScreenProps {
  onMenuPress: () => void;
}

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  gradient: [string, string];
}

function QuickActionCard({ icon, title, description, onPress, gradient }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionGradient}
      >
        <View style={styles.actionIcon}>
          <Ionicons name={icon} size={24} color={Theme.colors.textInverse} />
        </View>
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Theme.colors.textInverse} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function StatsCard({ title, value, change, isPositive }: StatsCardProps) {
  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsValue}>{value}</Text>
      <View style={styles.statsChange}>
        <Ionicons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={12}
          color={isPositive ? Theme.colors.success : Theme.colors.error}
        />
        <Text style={[
          styles.statsChangeText,
          { color: isPositive ? Theme.colors.success : Theme.colors.error }
        ]}>
          {change}
        </Text>
      </View>
    </View>
  );
}

function HomeScreen({ onMenuPress }: HomeScreenProps) {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: 'chatbubble-ellipses' as const,
      title: 'AI Chat Assistant',
      description: 'Get instant help with your questions',
      gradient: ['#667eea', '#764ba2'] as [string, string],
      onPress: () => console.log('Navigate to chat'),
    },
    {
      icon: 'school' as const,
      title: 'Academic Resources',
      description: 'Access courses, materials, and schedules',
      gradient: ['#f093fb', '#f5576c'] as [string, string],
      onPress: () => console.log('Navigate to academics'),
    },
    {
      icon: 'people' as const,
      title: 'Campus Community',
      description: 'Connect with students and faculty',
      gradient: ['#4facfe', '#00f2fe'] as [string, string],
      onPress: () => console.log('Navigate to community'),
    },
    {
      icon: 'calendar' as const,
      title: 'Events & Activities',
      description: 'Discover campus events and clubs',
      gradient: ['#43e97b', '#38f9d7'] as [string, string],
      onPress: () => console.log('Navigate to events'),
    },
  ];

  const stats = [
    { title: 'Chat Sessions', value: '12', change: '+8.2%', isPositive: true },
    { title: 'Study Hours', value: '45h', change: '+12%', isPositive: true },
    { title: 'Events Joined', value: '6', change: '+2', isPositive: true },
    { title: 'Resources Used', value: '28', change: '-5%', isPositive: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <LinearGradient
        colors={[Theme.colors.backgroundSecondary, Theme.colors.background]}
        style={styles.welcomeSection}
      >
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Ready to make the most of your campus experience?
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>
      </View>

      {/* Recent Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campus Updates</Text>
        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <View style={styles.updateIcon}>
              <Ionicons name="notifications" size={20} color={Theme.colors.primary} />
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>New AI Features Available!</Text>
              <Text style={styles.updateTime}>2 hours ago</Text>
            </View>
          </View>
          <Text style={styles.updateDescription}>
            Our AI assistant now supports course recommendations and study planning. 
            Try asking about your academic goals!
          </Text>
        </View>

        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <View style={styles.updateIcon}>
              <Ionicons name="calendar" size={20} color={Theme.colors.info} />
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>Campus Event: Tech Fair 2025</Text>
              <Text style={styles.updateTime}>1 day ago</Text>
            </View>
          </View>
          <Text style={styles.updateDescription}>
            Join us for the annual tech fair featuring student projects, 
            industry talks, and networking opportunities.
          </Text>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  welcomeSection: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  welcomeSubtitle: {
    ...Theme.typography.body1,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  statsCard: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    minWidth: 120,
    ...Theme.shadows.sm,
  },
  statsTitle: {
    ...Theme.typography.body2,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  statsValue: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  statsChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsChangeText: {
    ...Theme.typography.caption,
    fontWeight: '600',
  },
  actionsGrid: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  actionCard: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.md,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Theme.typography.body1,
    color: Theme.colors.textInverse,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    ...Theme.typography.body2,
    color: Theme.colors.textInverse,
    opacity: 0.9,
  },
  updateCard: {
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.sm,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    ...Theme.typography.body1,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  updateTime: {
    ...Theme.typography.caption,
    color: Theme.colors.textTertiary,
    marginTop: 2,
  },
  updateDescription: {
    ...Theme.typography.body2,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: Theme.spacing.xl,
  },
});

export default HomeScreen;