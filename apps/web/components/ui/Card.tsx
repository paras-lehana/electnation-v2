import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  withPaisley?: boolean;
}

const has_background_override = (className?: string) => /(?:^|\s)!?bg-[^\s]+/.test(className ?? '');
const has_padding_override = (className?: string) => /(?:^|\s)!?p[trblxy]?-[^\s]+/.test(className ?? '');
const has_border_width_override = (className?: string) =>
  /(?:^|\s)!?(?:border(?:\s|$)|border-0|border-[0-9]+|border-\[[^\]]+\])/.test(className ?? '');
const has_border_color_override = (className?: string) =>
  /(?:^|\s)!?border-(?!0|[0-9]+|x|y|t|r|b|l|solid|dashed|dotted|double|none|collapse|separate)[^\s]+/.test(
    className ?? '',
  );

export const Card = ({ children, className, withPaisley, ...props }: Props) => {
  const uses_custom_background = has_background_override(className);
  const uses_custom_padding = has_padding_override(className);
  const uses_custom_border_width = has_border_width_override(className);
  const uses_custom_border_color = has_border_color_override(className);

  return (
    <div
      {...props}
      className={clsx(
        'relative rounded-2xl shadow-khadi backdrop-blur-sm',
        !uses_custom_border_width && 'border',
        !uses_custom_border_color && 'border-khadi-200',
        !uses_custom_background && 'bg-white/80',
        !uses_custom_padding && 'p-6',
        withPaisley && 'paisley-corner',
        className,
      )}
    >
      {children}
    </div>
  );
};
