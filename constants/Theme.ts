/**
 * Modern Design System for CampusConnect
 * Beautiful, consistent styling across the app
 */

export const Theme = {
  colors: {
    // Primary brand colors - Modern blue gradient
    primary: '#667eea',
    primaryDark: '#5a67d8',
    primaryLight: '#7c3aed',
    
    // Secondary colors - Vibrant accent
    secondary: '#f093fb',
    secondaryDark: '#f093fb',
    secondaryLight: '#f9a8ff',
    
    // Background colors - Clean and modern
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    // Surface colors - Cards and elevated elements
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    
    // Text colors - High contrast and readable
    text: '#1a202c',
    textSecondary: '#4a5568',
    textTertiary: '#718096',
    textInverse: '#ffffff',
    
    // Status colors - Clear feedback
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    
    // Border colors - Subtle and clean
    border: '#e2e8f0',
    borderLight: '#f7fafc',
    borderDark: '#cbd5e0',
    
    // Overlay colors - For modals and shadows
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Typography scale - Consistent text sizes
  typography: {
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    h6: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
    
    body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    body3: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
    overline: { fontSize: 10, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 1.5 },
  },
  
  // Spacing scale - Consistent spacing throughout app
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius - Modern rounded corners
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
  
  // Shadow system - Depth and elevation
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Layout dimensions
  layout: {
    headerHeight: 60,
    drawerWidth: 280,
    bottomTabHeight: 60,
    fabSize: 56,
  },
  
  // Animation timings
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};