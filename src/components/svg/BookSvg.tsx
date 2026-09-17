interface BookSvgProps {
  className?: string;
}

export function BookSvg({ className = "" }: BookSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Book back cover */}
      <rect x="10" y="12" width="44" height="40" rx="3" fill="#795548" stroke="#4e342e" strokeWidth="2" />
      {/* Book pages */}
      <rect x="14" y="14" width="36" height="36" rx="2" fill="#fff8e1" stroke="#f5f5dc" strokeWidth="1" />
      {/* Page lines */}
      <path d="M20 24L44 24" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 30L44 30" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 36L44 36" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 42L36 42" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
      {/* Book spine */}
      <path
        d="M10 12L14 14L14 50L10 52"
        stroke="#4e342e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Book front cover edge */}
      <path
        d="M54 12L50 14L50 50L54 52"
        stroke="#4e342e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Star on cover */}
      <path
        d="M32 18L34 22L38 22L35 25L36 29L32 27L28 29L29 25L26 22L30 22Z"
        fill="#f5a623"
        stroke="#e65100"
        strokeWidth="1"
      />
    </svg>
  );
}
