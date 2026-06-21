import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Profile } from './App';

describe('Profile Component', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    displayName: 'Original Name',
    avatar: '',
    bio: 'Test bio',
    media: [],
  };

  it('allows saving a valid displayName', () => {
    const onUpdateMock = vi.fn();
    render(<Profile user={mockUser} onUpdate={onUpdateMock} />);

    // Initial state: bio triggers an onUpdate with current user+bio
    // We clear the mock to only test our handleSave interactions.
    onUpdateMock.mockClear();

    // Click "Edit Profile"
    fireEvent.click(screen.getByText('Edit Profile'));

    // Find the input and change the value
    const input = screen.getByTestId('display-name-input');
    fireEvent.change(input, { target: { value: 'New Name' } });

    // Click "Save"
    fireEvent.click(screen.getByText('Save'));

    // Assert that onUpdate was called with the new name
    expect(onUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'New Name'
      })
    );
  });

  it('prevents saving an empty displayName', () => {
    const onUpdateMock = vi.fn();
    render(<Profile user={mockUser} onUpdate={onUpdateMock} />);

    // Clear mock
    onUpdateMock.mockClear();

    // Click "Edit Profile"
    fireEvent.click(screen.getByText('Edit Profile'));

    // Find the input and clear the value
    const input = screen.getByTestId('display-name-input');
    fireEvent.change(input, { target: { value: '   ' } });

    // Click "Save"
    fireEvent.click(screen.getByText('Save'));

    // Assert that onUpdate was NOT called
    expect(onUpdateMock).not.toHaveBeenCalled();

    // Test empty string as well
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onUpdateMock).not.toHaveBeenCalled();
  });
});
