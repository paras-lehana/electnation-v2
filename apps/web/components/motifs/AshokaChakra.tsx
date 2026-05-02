/**
 * Inline SVG Ashoka Chakra. Stylized — kept neutral (indigo) and accessible
 * with `role="img"` + accessible name.
 */
import { clsx } from 'clsx';

interface ChakraProps {
  size?: number;
  className?: string;
  spinning?: boolean;
}

export const AshokaChakra = ({ size = 48, className, spinning = true }: ChakraProps) => {
  const spokes = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);
  return (
    <svg
      role="img"
      aria-label="Ashoka Chakra"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={clsx(spinning && 'animate-chakra-spin', className)}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      {spokes.map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2="50"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={`rotate(${deg} 50 50)`}
          opacity="0.85"
        />
      ))}
    </svg>
  );
};
