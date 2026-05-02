import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChatWidget } from './ChatWidget';
import { streamChatResponse } from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => ({
  streamChatResponse: vi.fn(),
}));

describe('ChatWidget', () => {
  it('opens, sends a civic question, and renders streamed Saathi tokens', async () => {
    vi.mocked(streamChatResponse).mockImplementation(async (_request, onDelta) => {
      onDelta('Register on ');
      onDelta('voters.eci.gov.in');
    });

    render(<ChatWidget />);
    await userEvent.click(screen.getByRole('button', { name: /open chunav saathi chat/i }));
    await userEvent.type(screen.getByPlaceholderText(/ask a question/i), 'How do I register?');
    await userEvent.click(screen.getByRole('button', { name: /send question to chunav saathi/i }));

    await waitFor(() =>
      expect(screen.getByText(/register on voters\.eci\.gov\.in/i)).toBeInTheDocument(),
    );
    expect(streamChatResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'How do I register?',
        locale: 'en',
        literacyComfort: 'standard',
      }),
      expect.any(Function),
    );
  });

  it('shows a safe fallback message when streaming fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(streamChatResponse).mockRejectedValue(new Error('network down'));

    render(<ChatWidget />);
    await userEvent.click(screen.getByRole('button', { name: /open chunav saathi chat/i }));
    await userEvent.type(screen.getByPlaceholderText(/ask a question/i), 'What is EPIC?');
    await userEvent.click(screen.getByRole('button', { name: /send question to chunav saathi/i }));

    await waitFor(() => expect(screen.getByText(/maaf karna/i)).toBeInTheDocument());
    expect(consoleError).toHaveBeenCalled();
  });
});
