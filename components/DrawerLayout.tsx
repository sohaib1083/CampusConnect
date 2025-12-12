import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Theme } from '@/constants/Theme';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernDrawer } from '@/components/ModernDrawer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Theme.layout.drawerWidth;

interface DrawerLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  headerTitle: string;
  headerSubtitle?: string;
  headerRightAction?: {
    icon: any;
    onPress: () => void;
  };
}

export function DrawerLayout({
  children,
  activeRoute,
  onNavigate,
  headerTitle,
  headerSubtitle,
  headerRightAction,
}: DrawerLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Only respond to horizontal swipes
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        if (isDrawerOpen) {
          // Closing gesture
          if (dx < 0) {
            const progress = Math.max(0, 1 + dx / DRAWER_WIDTH);
            drawerAnimation.setValue(progress);
            overlayAnimation.setValue(progress);
          }
        } else {
          // Opening gesture
          if (dx > 0 && evt.nativeEvent.pageX < 50) {
            const progress = Math.min(1, dx / DRAWER_WIDTH);
            drawerAnimation.setValue(progress);
            overlayAnimation.setValue(progress);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;
        const shouldOpen = isDrawerOpen
          ? dx > -DRAWER_WIDTH / 3 || vx > -0.5
          : dx > DRAWER_WIDTH / 3 || vx > 0.5;

        if (shouldOpen) {
          openDrawer();
        } else {
          closeDrawer();
        }
      },
    })
  ).current;

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: 1,
        duration: Theme.animation.normal,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 1,
        duration: Theme.animation.normal,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: Theme.animation.normal,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: Theme.animation.normal,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDrawerOpen(false);
    });
  };

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const overlayOpacity = overlayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container} {...panResponder.panHandlers}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <ModernHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            onMenuPress={openDrawer}
            rightAction={headerRightAction}
          />
          <View style={styles.content}>{children}</View>
        </View>

        {/* Overlay */}
        {isDrawerOpen && (
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
              pointerEvents="auto"
            />
          </TouchableWithoutFeedback>
        )}

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: drawerTranslateX }],
            },
          ]}
          pointerEvents={isDrawerOpen ? 'auto' : 'none'}
        >
          <ModernDrawer
            activeRoute={activeRoute}
            onNavigate={onNavigate}
            onClose={closeDrawer}
          />
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Theme.colors.background,
    zIndex: 2,
    ...Theme.shadows.xl,
  },
});