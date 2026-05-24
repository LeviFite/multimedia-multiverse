import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './App';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('useLocalStorage', () => {
  const key = 'test-key';
  const initialValue = { name: 'Jules' };

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with the initial value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(initialValue);
    // Initial value is not automatically set to localStorage by useState initialization.
    // It is written by the useEffect only after the initial render.
    // The hook in the component executes `useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);`
    expect(JSON.parse(window.localStorage.getItem(key))).toEqual(initialValue);
  });

  it('should initialize with the value from localStorage if it exists', () => {
    const existingValue = { name: 'Existing User' };
    window.localStorage.setItem(key, JSON.stringify(existingValue));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(existingValue);
  });

  it('should update the value and localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    const newValue = { name: 'New User' };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(JSON.parse(window.localStorage.getItem(key))).toEqual(newValue);
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useLocalStorage(key, 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toEqual(1);
    expect(JSON.parse(window.localStorage.getItem(key))).toEqual(1);
  });

  it('should handle errors when reading from localStorage and fallback to initial value', () => {
    // Mock getItem to throw an error
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(initialValue);

    getItemSpy.mockRestore();
  });

  it('should handle errors when writing to localStorage silently', () => {
    // Mock setItem to throw an error
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    const newValue = { name: 'Test' };

    // The hook should not crash when updating state
    expect(() => {
      act(() => {
        result.current[1](newValue);
      });
    }).not.toThrow();

    // State is still updated
    expect(result.current[0]).toEqual(newValue);

    setItemSpy.mockRestore();
  });
});
