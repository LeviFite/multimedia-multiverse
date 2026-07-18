import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Root from './App';

describe('Bio Update Benchmark', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('measures setItem calls when typing in bio', async () => {
    localStorage.setItem('demo_user', JSON.stringify({ id: '123', email: 'test@example.com', displayName: 'Test', bio: '', media: [] }));
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(<Root />);

    const bioInput = await screen.findByPlaceholderText('Tell the community about you…');

    const user = userEvent.setup();
    await user.type(bioInput, 'Hello World');

    bioInput.blur(); // Trigger blur

    console.log(`setItem called ${setItemSpy.mock.calls.length} times`);
  });
});
