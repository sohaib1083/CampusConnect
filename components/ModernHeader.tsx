import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function ModernHeader({ title, subtitle, onMenuPress, rightAction }: ModernHeaderProps) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      <LinearGradient
        colors={[Theme.colors.primary, Theme.colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {/* Left - Menu Button */}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="menu"
                size={24}
                color={Theme.colors.textInverse}
              />
            </TouchableOpacity>

            {/* Center - Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            {/* Right - Action Button */}
            <View style={styles.rightContainer}>
              {rightAction ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={rightAction.onPress}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={rightAction.icon}
                    size={24}
                    color={Theme.colors.textInverse}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...Theme.shadows.md,
  },
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    minHeight: Theme.layout.headerHeight - (Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0),
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.h5,
    color: Theme.colors.textInverse,
    fontWeight: '700',
  },
  subtitle: {
    ...Theme.typography.caption,
    color: Theme.colors.textInverse,
    opacity: 0.8,
    marginTop: 2,
  },
  rightContainer: {
    width: 44,
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
});