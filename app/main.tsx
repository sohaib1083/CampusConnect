import React, { useState } from 'react';
import { DrawerLayout } from '../components/DrawerLayout';

// Import our modern screen components  
import HomeScreen from '../components/screens/HomeScreen';
import ChatScreen from '../components/screens/ChatScreen';
import ExploreScreen from '../components/screens/ExploreScreen';
import FeedbackScreen from '../components/screens/FeedbackScreen';
import ProfileScreen from '../components/screens/ProfileScreen';

export type Screen = 'home' | 'chat' | 'explore' | 'feedback' | 'profile';

const screenInfo = {
  home: { title: 'Campus Home', subtitle: 'Welcome to CampusConnect' },
  chat: { title: 'AI Assistant', subtitle: 'Ask me anything about campus' },
  explore: { title: 'Explore Campus', subtitle: 'Discover opportunities' },
  feedback: { title: 'Feedback', subtitle: 'Help us improve' },
  profile: { title: 'My Profile', subtitle: 'Manage your account' },
};

/**
 * Main app screen with modern drawer navigation
 * Manages screen switching and drawer state
 */
export default function MainScreen() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const handleMenuPress = () => {
    // Drawer will handle this internally
  };

  const handleNavigate = (route: string) => {
    // Map the route names from drawer to our screen keys
    const routeMap: { [key: string]: Screen } = {
      'index': 'home',
      'home': 'home',
      'chat': 'chat',
      'explore': 'explore',
      'feedback': 'feedback',
      'profile': 'profile',
    };
    
    const mappedRoute = routeMap[route] || 'home';
    setCurrentScreen(mappedRoute);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onMenuPress={handleMenuPress} />;
      case 'chat':
        return <ChatScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onMenuPress={handleMenuPress} />;
    }
  };

  const currentInfo = screenInfo[currentScreen];
  const activeRoute = currentScreen === 'home' ? 'index' : currentScreen;

  return (
    <DrawerLayout 
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      headerTitle={currentInfo.title}
      headerSubtitle={currentInfo.subtitle}
    >
      {renderScreen()}
    </DrawerLayout>
  );
}