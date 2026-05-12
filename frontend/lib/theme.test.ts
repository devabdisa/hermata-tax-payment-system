/**
 * Unit Tests for Theme Management Utilities
 * 
 * Tests the theme application, storage, and system preference detection
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyTheme, getStoredTheme, getResolvedTheme, watchSystemTheme, initializeTheme } from './theme';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe('Theme Management Utilities', () => {
  beforeEach(() => {
    // Setup DOM
    if (typeof document !== 'undefined') {
      document.documentElement.className = '';
    }
    
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    localStorageMock.clear();
    
    // Setup matchMedia mock (default to light mode)
    Object.defineProperty(window, 'matchMedia', {
      value: createMatchMediaMock(false),
      writable: true
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('applyTheme', () => {
    it('should apply light mode correctly', () => {
      applyTheme('light');
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
    });
    
    it('should apply dark mode correctly', () => {
      applyTheme('dark');
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('dark');
    });
    
    it('should apply system mode and resolve to light when OS prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: createMatchMediaMock(false), // OS prefers light
        writable: true
      });
      
      applyTheme('system');
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('system');
    });
    
    it('should apply system mode and resolve to dark when OS prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: createMatchMediaMock(true), // OS prefers dark
        writable: true
      });
      
      applyTheme('system');
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('system');
    });
    
    it('should dispatch theme change event', () => {
      const eventListener = vi.fn();
      window.addEventListener('themechange', eventListener);
      
      applyTheme('dark');
      
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { mode: 'dark' }
        })
      );
      
      window.removeEventListener('themechange', eventListener);
    });
    
    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });
      
      // Should not throw
      expect(() => applyTheme('dark')).not.toThrow();
      
      // Theme should still be applied to DOM
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      // Restore
      localStorage.setItem = originalSetItem;
    });
    
    it('should remove previous theme class when switching', () => {
      applyTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      applyTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
  
  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });
    
    it('should return light as default when no theme is stored', () => {
      expect(getStoredTheme()).toBe('light');
    });
    
    it('should return light as default when invalid theme is stored', () => {
      localStorage.setItem('theme', 'invalid');
      expect(getStoredTheme()).toBe('light');
    });
    
    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });
      
      expect(getStoredTheme()).toBe('light');
      
      localStorage.getItem = originalGetItem;
    });
  });
  
  describe('getResolvedTheme', () => {
    it('should return light for light mode', () => {
      expect(getResolvedTheme('light')).toBe('light');
    });
    
    it('should return dark for dark mode', () => {
      expect(getResolvedTheme('dark')).toBe('dark');
    });
    
    it('should resolve system mode to light when OS prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: createMatchMediaMock(false),
        writable: true
      });
      
      expect(getResolvedTheme('system')).toBe('light');
    });
    
    it('should resolve system mode to dark when OS prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: createMatchMediaMock(true),
        writable: true
      });
      
      expect(getResolvedTheme('system')).toBe('dark');
    });
  });
  
  describe('watchSystemTheme', () => {
    it('should call callback when system theme changes', () => {
      const callback = vi.fn();
      const listeners: Array<(e: any) => void> = [];
      
      // Mock matchMedia with addEventListener support
      Object.defineProperty(window, 'matchMedia', {
        value: (query: string) => ({
          matches: false,
          media: query,
          addEventListener: (event: string, handler: (e: any) => void) => {
            listeners.push(handler);
          },
          removeEventListener: vi.fn(),
        }),
        writable: true
      });
      
      const cleanup = watchSystemTheme(callback);
      
      // Simulate system theme change
      listeners.forEach(listener => listener({ matches: true }));
      
      expect(callback).toHaveBeenCalledWith(true);
      
      cleanup();
    });
    
    it('should return no-op cleanup when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true
      });
      
      const cleanup = watchSystemTheme(vi.fn());
      
      expect(() => cleanup()).not.toThrow();
    });
  });
  
  describe('initializeTheme', () => {
    it('should initialize theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      
      initializeTheme();
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
    
    it('should initialize with light theme when no stored preference', () => {
      initializeTheme();
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });
});
