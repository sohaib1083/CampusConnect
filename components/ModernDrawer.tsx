import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/SimpleFirebaseAuthContext';

interface DrawerItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  badge?: string;
}

function DrawerItem({ icon, label, onPress, isActive, badge }: DrawerItemProps) {
  return (
    <TouchableOpacity
      style={[styles.drawerItem, isActive && styles.drawerItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
          <Ionicons
            name={icon}
            size={22}
            color={isActive ? Theme.colors.primary : Theme.colors.textSecondary}
          />
        </View>
        <Text style={[styles.itemLabel, isActive && styles.itemLabelActive]}>
          {label}
        </Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface ModernDrawerProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
}

export function ModernDrawer({ activeRoute, onNavigate, onClose }: ModernDrawerProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: 'home-outline' as const, label: 'Home', route: 'index' },
    { icon: 'chatbubble-outline' as const, label: 'AI Chat', route: 'chat', badge: 'New' },
    { icon: 'compass-outline' as const, label: 'Explore', route: 'explore' },
    { icon: 'star-outline' as const, label: 'Feedback', route: 'feedback' },
    { icon: 'person-outline' as const, label: 'Profile', route: 'profile' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with User Info */}
      <LinearGradient
        colors={[Theme.colors.primary, Theme.colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={Theme.colors.textInverse} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={32} color={Theme.colors.textInverse} />
            )}
          </View>
          <Text style={styles.userName}>
            {user?.displayName || 'Campus User'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'welcome@campus.edu'}
          </Text>
        </View>
      </LinearGradient>

      {/* Navigation Menu */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>NAVIGATION</Text>
          {menuItems.map((item) => (
            <DrawerItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              onPress={() => {
                onNavigate(item.route);
                onClose();
              }}
              isActive={activeRoute === item.route}
              badge={item.badge}
            />
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <DrawerItem
            icon="settings-outline"
            label="Settings"
            onPress={() => {
              // Handle settings navigation
              onClose();
            }}
          />
          <DrawerItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {
              // Handle help navigation
              onClose();
            }}
          />
        </View>
      </ScrollView>

      {/* Footer with Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Theme.colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>CampusConnect v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  userName: {
    ...Theme.typography.h5,
    color: Theme.colors.textInverse,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    ...Theme.typography.body2,
    color: Theme.colors.textInverse,
    opacity: 0.8,
  },
  menu: {
    flex: 1,
    paddingTop: Theme.spacing.md,
  },
  menuSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.overline,
    color: Theme.colors.textTertiary,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  drawerItem: {
    marginHorizontal: Theme.spacing.sm,
    marginVertical: 2,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  drawerItemActive: {
    backgroundColor: `${Theme.colors.primary}15`,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  iconContainerActive: {
    backgroundColor: `${Theme.colors.primary}25`,
  },
  itemLabel: {
    ...Theme.typography.body1,
    color: Theme.colors.text,
    flex: 1,
  },
  itemLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.round,
  },
  badgeText: {
    ...Theme.typography.caption,
    color: Theme.colors.textInverse,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.backgroundSecondary,
    marginBottom: Theme.spacing.md,
  },
  logoutText: {
    ...Theme.typography.body1,
    color: Theme.colors.error,
    marginLeft: Theme.spacing.sm,
    fontWeight: '600',
  },
  version: {
    ...Theme.typography.caption,
    color: Theme.colors.textTertiary,
    textAlign: 'center',
  },
});