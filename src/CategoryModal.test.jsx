import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CategoryModal } from './App';
import React from 'react';

// Mock the TOP_THREADS which are internal to App.jsx but used in CategoryModal.
// We know that TOP_THREADS has specific categories based on the source code.
// For the test, we'll use actual titles from TOP_THREADS if possible, or just verify the rendering.
// Since TOP_THREADS is not exported, we test the rendering output based on its hardcoded values.

describe('CategoryModal', () => {
  it('does not render when category is null', () => {
    const { container } = render(<CategoryModal category={null} show={true} onHide={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correctly with a valid category and filters threads', () => {
    const mockCategory = {
      key: 'gaming',
      label: 'Gaming',
      icon: () => <svg data-testid="mock-icon" />,
      color: '#000'
    };

    render(<CategoryModal category={mockCategory} show={true} onHide={() => {}} />);

    // Check if the modal title contains the category label
    expect(screen.getByText(/Gaming — Top Threads/i)).toBeInTheDocument();

    // Check if the icon is rendered
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();

    // Check if threads from the selected category are displayed.
    // Looking at the hardcoded TOP_THREADS in App.jsx:
    // 'Welcome! Read this first' is 'general'
    // 'Underrated indie games' is 'gaming'
    // App.jsx logic: TOP_THREADS.filter(t => t.category === category.key || category.key === 'general')
    // This means if category is 'gaming', it ONLY shows 'gaming' threads. It does NOT show 'general' threads.
    expect(screen.queryByText('Welcome! Read this first')).not.toBeInTheDocument();
    expect(screen.getByText('Underrated indie games')).toBeInTheDocument();

    // It should NOT render a thread from another category, e.g., 'photos'
    expect(screen.queryByText('Best camera phone in 2025?')).not.toBeInTheDocument();
  });

  it('calls onHide when the close button in the footer is clicked', () => {
    const mockOnHide = vi.fn();
    const mockCategory = {
      key: 'general',
      label: 'General',
      icon: () => <svg />,
      color: '#000'
    };

    render(<CategoryModal category={mockCategory} show={true} onHide={mockOnHide} />);

    // Click the "Close" button in the footer
    const closeBtns = screen.getAllByRole('button', { name: /close/i });
    // There might be two close buttons: one in header, one in footer. Click the last one.
    fireEvent.click(closeBtns[closeBtns.length - 1]);

    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });
});
