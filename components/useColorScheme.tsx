import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as RNuseColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'auto',
  setThemeMode: async () => {},
  theme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const systemScheme = RNuseColorScheme();

  useEffect(() => {
    // Load persisted theme preference on mount
    AsyncStorage.getItem('app_theme_mode').then((val) => {
      if (val === 'light' || val === 'dark' || val === 'auto') {
        setThemeModeState(val);
      }
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem('app_theme_mode', mode);
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (themeMode === 'light') {
      setTheme('light');
    } else if (themeMode === 'dark') {
      setTheme('dark');
    } else {
      // 'auto' mode: checks system color scheme and time-of-day
      const currentHour = new Date().getHours();
      const isNightTime = currentHour >= 18 || currentHour < 6;
      if (systemScheme) {
        setTheme(systemScheme);
      } else {
        setTheme(isNightTime ? 'dark' : 'light');
      }
    }
  }, [themeMode, systemScheme]);

  // Periodically check time in background if in auto mode
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const checkTime = () => {
      const currentHour = new Date().getHours();
      const isNightTime = currentHour >= 18 || currentHour < 6;
      if (!systemScheme) {
        setTheme(isNightTime ? 'dark' : 'light');
      }
    };

    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function useColorScheme() {
  const { theme } = useAppTheme();
  return theme;
}
