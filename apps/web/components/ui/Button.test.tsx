import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders an accessible button and forwards clicks', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Start my Yatra</Button>);

    const button = screen.getByRole('button', { name: /start my yatra/i });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('honors disabled state for guarded actions', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Verify this Forward
      </Button>,
    );

    const button = screen.getByRole('button', { name: /verify this forward/i });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
