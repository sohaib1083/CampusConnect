import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@campus_connect:auth_token',
  USER_DATA: '@campus_connect:user_data',
  CHAT_HISTORY: '@campus_connect:chat_history',
  THEME: '@campus_connect:theme',
  ONBOARDING_COMPLETE: '@campus_connect:onboarding_complete',
} as const;

/**
 * Store a value
 */
export async function storeData(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

/**
 * Retrieve a value
 */
export async function getData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

/**
 * Remove a value
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
