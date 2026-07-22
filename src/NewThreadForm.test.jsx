import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NewThreadForm } from './App';
import * as supabaseModule from '@supabase/supabase-js';

const { mockInsert } = vi.hoisted(() => ({ mockInsert: vi.fn() }));

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn().mockReturnValue({
        insert: mockInsert
      })
    }))
  };
});


describe('NewThreadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays error when API fails', async () => {
    mockInsert.mockResolvedValueOnce({ error: new Error('Mock API Error') });
    const user = { id: '1', displayName: 'Test User' };
    render(<NewThreadForm user={user} />);

    fireEvent.change(screen.getByPlaceholderText('Thread title'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write something…'), { target: { value: 'My Body' } });

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText('Mock API Error')).toBeInTheDocument();
    });
  });

  it('successfully creates thread and clears form', async () => {
    mockInsert.mockResolvedValueOnce({ error: null });
    const user = { id: '1', displayName: 'Test User' };
    const onCreated = vi.fn();
    render(<NewThreadForm user={user} onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText('Thread title'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write something…'), { target: { value: 'My Body' } });

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalled();
    });

    expect(screen.getByPlaceholderText('Thread title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Write something…')).toHaveValue('');
  });
});
