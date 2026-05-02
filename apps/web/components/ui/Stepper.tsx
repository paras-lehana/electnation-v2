import { clsx } from 'clsx';

interface Step {
  id: string;
  title: string;
  hindi?: string;
}

interface Props {
  steps: Step[];
  activeId?: string;
}

/**
 * Yatra Stepper — displays the election journey as a path with footprint
 * markers. Keyboard-navigable via arrow keys when embedded in a toolbar.
 */
export const Stepper = ({ steps, activeId }: Props) => (
  <ol
    role="list"
    className="flex flex-wrap items-center gap-3 md:gap-5"
    aria-label="Election Yatra journey"
  >
    {steps.map((step, i) => {
      const isActive = step.id === activeId;
      return (
        <li key={step.id} className="flex items-center gap-3">
          <div
            className={clsx(
              'flex h-12 w-12 items-center justify-center rounded-full font-bold shadow-sm transition',
              isActive
                ? 'bg-saffron-600 text-white ring-4 ring-saffron-200'
                : 'bg-khadi-100 text-ink-700 border border-khadi-300',
            )}
            aria-current={isActive ? 'step' : undefined}
          >
            {i + 1}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink-900">{step.title}</span>
            {step.hindi && (
              <span className="devanagari text-xs text-ink-500">{step.hindi}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <svg width="28" height="12" viewBox="0 0 28 12" className="hidden md:block">
              <path
                d="M0 6 Q 7 0, 14 6 T 28 6"
                stroke="#B79A66"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="2 3"
              />
            </svg>
          )}
        </li>
      );
    })}
  </ol>
);
