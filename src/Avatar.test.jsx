import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './App';

describe('Avatar component', () => {
  it('renders correctly with an image source', () => {
    const { getByAltText } = render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" size={64} />);
    const imgElement = getByAltText('John Doe');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(imgElement.parentElement).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('renders correctly with initials when no image source is provided', () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    const initialsElement = getByText('J');
    expect(initialsElement).toBeInTheDocument();
  });

  it('renders default initial when no name is provided', () => {
    const { getByText } = render(<Avatar />);
    const defaultInitialElement = getByText('U');
    expect(defaultInitialElement).toBeInTheDocument();
  });

  it('handles default size when not specified', () => {
    const { container } = render(<Avatar name="John Doe" />);
    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveStyle({ width: '56px', height: '56px' });
  });
});
