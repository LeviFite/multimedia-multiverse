import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn().mockRejectedValue(new Error('Simulated Supabase login failure')),
      signUp: vi.fn().mockRejectedValue(new Error('Simulated Supabase signup failure')),
    }
  })
}));

// We need to set the variables that trigger REMOTE_ENABLED to true
window.SUPABASE_URL = "http://fake.supabase.co";
window.SUPABASE_ANON_KEY = "fake_key";

import { AuthModals } from '../App';

describe('AuthModals Error Handling', () => {
  it('displays an error message when login fails', async () => {
    const onHide = vi.fn();
    const onLogin = vi.fn();

    render(<AuthModals show={true} onHide={onHide} onLogin={onLogin} />);

    const user = userEvent.setup();

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Simulated Supabase login failure')).toBeInTheDocument();
    });
  });

  it('displays an error message when signup fails', async () => {
    const onHide = vi.fn();
    const onLogin = vi.fn();

    render(<AuthModals show={true} onHide={onHide} onLogin={onLogin} />);

    const user = userEvent.setup();

    // Switch to signup mode
    const toggleButton = screen.getByRole('button', { name: /New here\? Create an account/i });
    await user.click(toggleButton);

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const displayNameInput = screen.getByPlaceholderText('Levi F.');
    const submitButton = screen.getByRole('button', { name: /Sign up/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.type(displayNameInput, 'TestUser');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Simulated Supabase signup failure')).toBeInTheDocument();
    });
  });
});
