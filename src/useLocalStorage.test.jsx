import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './App';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Clear mocks
    vi.clearAllMocks();
  });

  it('should use initial value if local storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('initialValue');
  });

  it('should use value from local storage if it exists', () => {
    window.localStorage.setItem('testKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update local storage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should handle JSON parse error by returning initial value', () => {
    // Write invalid JSON to local storage
    window.localStorage.setItem('testKey', 'invalid-json');

    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    // Should fallback to initial value because parsing throws
    expect(result.current[0]).toBe('initialValue');
  });

  it('should handle localStorage being unavailable (e.g. throws error)', () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    expect(result.current[0]).toBe('initialValue');
    getItemSpy.mockRestore();
  });

  it('should handle errors when setting items', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    // Value should still update in memory even if localStorage fails
    expect(result.current[0]).toBe('newValue');
    setItemSpy.mockRestore();
  });
});
