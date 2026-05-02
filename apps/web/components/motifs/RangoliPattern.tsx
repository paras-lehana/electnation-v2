/**
 * Rangoli pattern — decorative SVG for section backgrounds.
 */
export const RangoliPattern = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="rg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F6A623" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#F6A623" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#rg)" />
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i} transform={`rotate(${i * 45} 100 100)`}>
        <path
          d="M100 20 C 120 55, 120 85, 100 100 C 80 85, 80 55, 100 20 Z"
          fill="none"
          stroke="#7B1E3A"
          strokeWidth="1.2"
          opacity="0.55"
        />
        <circle cx="100" cy="30" r="3" fill="#FF9933" />
      </g>
    ))}
    <circle cx="100" cy="100" r="6" fill="#138808" />
  </svg>
);
