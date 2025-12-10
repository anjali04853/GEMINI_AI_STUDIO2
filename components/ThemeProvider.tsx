import React, { useEffect } from 'react';
import { useThemeStore, applyTheme, applyAccentColor } from '../store/themeStore';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, accentColor } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when it changes
    applyTheme(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    // Apply accent color on mount and when it changes
    applyAccentColor(accentColor);
  }, [accentColor]);

  return <>{children}</>;
};

export default ThemeProvider;
