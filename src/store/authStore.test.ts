import { act, renderHook } from '@testing-library/react';
import useAuthStore from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalse();
    expect(result.current.isLoading).toBeFalse();
    expect(result.current.error).toBeNull();
  });

  test('handles successful login', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('admin', 'password');
    });

    expect(result.current.isAuthenticated).toBeTrue();
    expect(result.current.user).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  test('handles failed login', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('wrong', 'credentials');
    });

    expect(result.current.isAuthenticated).toBeFalse();
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  test('handles registration', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.register('newuser', 'test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBeTrue();
    expect(result.current.user).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  test('handles logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBeFalse();
    expect(result.current.user).toBeNull();
  });
});