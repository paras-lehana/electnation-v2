import { clsx } from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'henna';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClass: Record<
  Variant,
  { background: string; border_color?: string; border_width?: string; foreground: string; shadow?: string }
> = {
  primary: {
    background: 'bg-saffron-500 hover:bg-saffron-600',
    foreground: 'text-white',
    shadow: 'shadow-diya hover:shadow-khadi',
  },
  ghost: {
    background: 'bg-khadi-100 hover:bg-khadi-200',
    border_color: 'border-khadi-300',
    border_width: 'border',
    foreground: 'text-ink-900',
  },
  henna: {
    background: 'bg-henna-500 hover:bg-henna-700',
    foreground: 'text-white',
  },
};

const has_background_override = (className?: string) => /(?:^|\s)!?bg-[^\s]+/.test(className ?? '');
const has_text_color_override = (className?: string) =>
  /(?:^|\s)!?text-(?:white|black|transparent|current|inherit|\[[^\]]+\]|(?:ink|saffron|leaf|indigo|khadi|marigold|henna|red|green|blue|gray|slate|zinc|neutral|stone|orange|yellow|emerald|teal|cyan|sky|violet|purple|pink|rose)-[^\s]+)/.test(
    className ?? '',
  );
const has_border_width_override = (className?: string) =>
  /(?:^|\s)!?(?:border(?:\s|$)|border-0|border-[0-9]+|border-\[[^\]]+\])/.test(className ?? '');
const has_border_color_override = (className?: string) =>
  /(?:^|\s)!?border-(?!0|[0-9]+|x|y|t|r|b|l|solid|dashed|dotted|double|none|collapse|separate)[^\s]+/.test(
    className ?? '',
  );

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className, children, ...rest }, ref) => {
    const selected_variant = variantClass[variant];

    return (
      <button
        ref={ref}
        {...rest}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:active:scale-100',
          !has_background_override(className) && selected_variant.background,
          !has_text_color_override(className) && selected_variant.foreground,
          !has_border_width_override(className) && selected_variant.border_width,
          !has_border_color_override(className) && selected_variant.border_color,
          selected_variant.shadow,
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
