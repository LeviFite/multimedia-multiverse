import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import App from '../src/App';
import * as React from 'react';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        signOut: vi.fn()
      },
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-url' } })
        })
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            range: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      })
    })
  };
});

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/A cute, stylish media forum/i)).toBeInTheDocument();
  });
});
