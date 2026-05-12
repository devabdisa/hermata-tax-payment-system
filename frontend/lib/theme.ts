/**
 * Theme Management Utilities
 * 
 * Provides functions for applying and managing theme modes (light, dark, system)
 * with localStorage persistence and event dispatching for component updates.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Apply theme to the application
 * 
 * Preconditions:
 * - mode is one of 'light', 'dark', or 'system'
 * - Document root element exists
 * 
 * Postconditions:
 * - CSS custom properties are updated to match selected mode
 * - If mode is 'system', theme matches OS preference
 * - Theme change is persisted to localStorage (if available)
 * - Theme change event is dispatched
 * 
 * @param mode - The theme mode to apply
 */
export function applyTheme(mode: ThemeMode): void {
  try {
    // Step 1: Resolve actual theme if system mode
    let resolvedMode: 'light' | 'dark' = 'light';
    
    if (mode === 'system') {
      // Detect OS preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      }
    } else {
      resolvedMode = mode;
    }
    
    // Step 2: Update document class
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedMode);
    }
    
    // Step 3: Persist preference to localStorage (with fallback)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', mode);
      }
    } catch (error) {
      // localStorage not available - continue without persisting
      console.warn('localStorage not available, theme preference will not be persisted:', error);
    }
    
    // Step 4: Dispatch theme change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { mode: resolvedMode } 
      }));
    }
  } catch (error) {
    // Fall back to light mode on any error
    console.error('Error applying theme, falling back to light mode:', error);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add('light');
    }
  }
}

/**
 * Get the current theme mode from localStorage
 * 
 * Postconditions:
 * - Returns stored theme mode or 'light' as fallback
 * - Never throws errors
 * 
 * @returns The stored theme mode or 'light' as default
 */
export function getStoredTheme(): ThemeMode {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
  }
  
  // Fallback to light mode
  return 'light';
}

/**
 * Get the resolved theme (actual light or dark, not system)
 * 
 * @param mode - The theme mode (may be 'system')
 * @returns The resolved theme ('light' or 'dark')
 */
export function getResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    return 'light';
  }
  return mode;
}

/**
 * Listen for system theme changes and update if in system mode
 * 
 * @param callback - Function to call when system theme changes
 * @returns Cleanup function to remove the listener
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {}; // No-op cleanup
  }
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
  
  // Fallback for older browsers
  if (mediaQuery.addListener) {
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }
  
  return () => {}; // No-op cleanup
}

/**
 * Initialize theme on page load
 * Should be called as early as possible to prevent flash of wrong theme
 */
export function initializeTheme(): void {
  const storedMode = getStoredTheme();
  applyTheme(storedMode);
}
