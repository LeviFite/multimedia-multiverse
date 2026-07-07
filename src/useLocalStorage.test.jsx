import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './App';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));
    expect(result.current[0]).toBe('default-val');
  });

  it('should initialize with existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing-val'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));
    expect(result.current[0]).toBe('existing-val');
  });

  it('should update state and localStorage when setting a new value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));

    act(() => {
      result.current[1]('new-val');
    });

    expect(result.current[0]).toBe('new-val');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-val'));
  });

  it('should handle functional state updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('count')).toBe(JSON.stringify(1));
  });

  it('should handle error in localStorage.getItem gracefully', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));
    expect(result.current[0]).toBe('default-val');

    getItemSpy.mockRestore();
  });

  it('should handle error in localStorage.setItem gracefully', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'default-val'));

    act(() => {
      result.current[1]('new-val');
    });

    expect(result.current[0]).toBe('new-val');
    // We expect it not to crash despite the setItem error

    setItemSpy.mockRestore();
  });
});
