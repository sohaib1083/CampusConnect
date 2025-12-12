import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';

interface CategoryCardProps {
  id: string;
  title: string;
  icon: string;
  gradient: [string, string];
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, gradient, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.categoryIconContainer}>
          <Ionicons name={icon as any} size={32} color={Theme.colors.textInverse} />
        </View>
        <Text style={styles.categoryTitle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

/**
 * Modern ExploreScreen - Beautiful discovery interface with gradient cards
 * Organized categories and quick actions for easy navigation
 */
const ExploreScreen: React.FC = () => {
  const categories = [
    { 
      id: '1', 
      title: 'Academic', 
      icon: 'school', 
      gradient: [Theme.colors.primary, Theme.colors.primaryLight] as [string, string]
    },
    { 
      id: '2', 
      title: 'Events', 
      icon: 'calendar', 
      gradient: [Theme.colors.secondary, Theme.colors.secondaryLight] as [string, string]
    },
    { 
      id: '3', 
      title: 'Campus Map', 
      icon: 'map', 
      gradient: [Theme.colors.success, '#68d391'] as [string, string]
    },
    { 
      id: '4', 
      title: 'Facilities', 
      icon: 'business', 
      gradient: [Theme.colors.warning, '#fbb040'] as [string, string]
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>What are you looking for?</Text>
          <Text style={styles.welcomeSubtitle}>
            Explore everything your campus has to offer
          </Text>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                onPress={() => console.log(`Navigate to ${category.title}`)}
              />
            ))}
          </View>
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
  welcomeSection: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
  },
  welcomeTitle: {
    fontSize: Theme.typography.h4.fontSize,
    fontWeight: Theme.typography.h4.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: Theme.typography.body2.fontSize,
    color: Theme.colors.textSecondary,
    lineHeight: Theme.typography.body2.lineHeight,
  },
  categoriesSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.h5.fontSize,
    fontWeight: Theme.typography.h5.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  categoryGradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  categoryIconContainer: {
    marginBottom: Theme.spacing.sm,
  },
  categoryTitle: {
    fontSize: Theme.typography.body2.fontSize,
    fontWeight: Theme.typography.body2.fontWeight,
    color: Theme.colors.textInverse,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: Theme.spacing.xl,
  },
});

export default ExploreScreen;