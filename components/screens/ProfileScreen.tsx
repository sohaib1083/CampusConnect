import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';
import { Theme } from '@/constants/Theme';

interface ProfileScreenProps {}

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  color = Theme.colors.primary 
}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.menuIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[color, color + 'CC']}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon as any} size={28} color={Theme.colors.textInverse} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </View>
  );
};

/**
 * Modern ProfileScreen - Beautiful user profile with stats and settings
 * Clean card-based design with gradient accents
 */
const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', subtitle: 'Update your information', onPress: () => console.log('Edit Profile') },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage your alerts', onPress: () => console.log('Notifications') },
    { icon: 'shield-checkmark-outline', title: 'Privacy & Security', subtitle: 'Control your data', onPress: () => console.log('Privacy') },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get assistance', onPress: () => console.log('Help') },
    { icon: 'information-circle-outline', title: 'About', subtitle: 'App information', onPress: () => console.log('About') },
  ];

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <View style={styles.loginIconContainer}>
            <LinearGradient
              colors={[Theme.colors.primary, Theme.colors.secondary]}
              style={styles.loginIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person" size={40} color={Theme.colors.textInverse} />
            </LinearGradient>
          </View>
          <Text style={styles.loginTitle}>Login Required</Text>
          <Text style={styles.loginText}>
            Please sign in to your account to view and manage your profile
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[Theme.colors.primary, Theme.colors.secondary]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Theme.colors.textInverse} />
              </View>
            </View>
            <Text style={styles.userName}>{user?.email || 'User'}</Text>
            <Text style={styles.userSubtitle}>Campus Connect Member</Text>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            <StatCard
              title="Chats"
              value="12"
              icon="chatbubbles"
              color={Theme.colors.primary}
            />
            <StatCard
              title="Feedback"
              value="3"
              icon="star"
              color={Theme.colors.secondary}
            />
            <StatCard
              title="Explore"
              value="8"
              icon="compass"
              color={Theme.colors.success}
            />
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Theme.colors.error, '#dc3545']}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color={Theme.colors.textInverse} />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={24} color={Theme.colors.textInverse} />
                  <Text style={styles.logoutText}>Sign Out</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    marginBottom: Theme.spacing.lg,
  },
  profileGradient: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
    paddingTop: Theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.textInverse,
  },
  userName: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: Theme.typography.h4.fontWeight,
    color: Theme.colors.textInverse,
    marginBottom: Theme.spacing.xs,
  },
  userSubtitle: {
    fontSize: Theme.typography.body2.fontSize,
    color: 'rgba(255,255,255,0.8)',
  },
  statsSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.h5.fontSize,
    fontWeight: Theme.typography.h5.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  statGradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textInverse,
    marginTop: Theme.spacing.xs,
  },
  statTitle: {
    fontSize: Theme.typography.caption.fontSize,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Theme.spacing.xs,
  },
  menuSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  menuContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: Theme.typography.body1.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs / 2,
  },
  menuItemSubtitle: {
    fontSize: Theme.typography.caption.fontSize,
    color: Theme.colors.textSecondary,
  },
  logoutSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  logoutButton: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  logoutText: {
    fontSize: Theme.typography.body1.fontSize,
    fontWeight: Theme.typography.body1.fontWeight,
    color: Theme.colors.textInverse,
    marginLeft: Theme.spacing.sm,
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  loginIconContainer: {
    marginBottom: Theme.spacing.lg,
  },
  loginIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: Theme.typography.h4.fontWeight,
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
  bottomSpacing: {
    height: Theme.spacing.xl,
  },
});

export default ProfileScreen;