// CampusConnect AI brand colors
const primaryColor = '#2563eb'; // Blue
const secondaryColor = '#10b981'; // Green
const accentColor = '#f59e0b'; // Amber

const tintColorLight = primaryColor;
const tintColorDark = '#60a5fa';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    card: '#f8f9fa',
    border: '#e0e0e0',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    card: '#1e1e1e',
    border: '#333',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
  },
};
