import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './Stepper';

const steps = [
  { id: 'registration', title: 'Registration', hindi: 'पंजीकरण' },
  { id: 'verification', title: 'Verification', hindi: 'सत्यापन' },
  { id: 'poll-day', title: 'Poll Day' },
];

describe('Stepper', () => {
  it('labels the Election Yatra journey and marks the current step', () => {
    render(<Stepper steps={steps} activeId="verification" />);

    expect(screen.getByRole('list', { name: /election yatra journey/i })).toBeInTheDocument();
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('सत्यापन')).toBeInTheDocument();
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'step');
  });
});
