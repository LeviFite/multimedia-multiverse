import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './App';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Restore mocks
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value when no value is in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return parsed value when value exists in localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('testKey'))).toBe('updated');
  });

  it('should return initial value and handle error when localStorage.getItem throws', () => {
    // Mock getItem to throw an error
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is disabled');
    });

    const { result } = renderHook(() => useLocalStorage('errorKey', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('errorKey');
  });

  it('should handle error when localStorage.setItem throws', () => {
    // Mock setItem to throw an error
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // The state should still update in memory even if localStorage fails
    expect(result.current[0]).toBe('new-value');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('testKey', '"new-value"');
  });
});
