import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NewThreadForm } from './App';
import * as supabaseModule from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: new Error('Mock API Error') })
      })
    }))
  };
});


describe('NewThreadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays error when API fails', async () => {
    const user = { id: '1', displayName: 'Test User' };
    render(<NewThreadForm user={user} />);

    fireEvent.change(screen.getByPlaceholderText('Thread title'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write something…'), { target: { value: 'My Body' } });

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText('Mock API Error')).toBeInTheDocument();
    });
  });
});
