interface AbcSvgProps {
  className?: string;
}

export function AbcSvg({ className = "" }: AbcSvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#2e7d32" opacity="0.15" />
      <text x="32" y="42" textAnchor="middle" fill="#2e7d32" fontSize="24" fontWeight="bold" fontFamily="sans-serif">ABC</text>
    </svg>
  );
}

interface HexagonSvgProps {
  className?: string;
}

export function HexagonSvg({ className = "" }: HexagonSvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M32 6L54 18V46L32 58L10 46V18L32 6Z"
        fill="#f5a623"
        opacity="0.2"
        stroke="#f5a623"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="8" fill="#f5a623" opacity="0.4" />
    </svg>
  );
}

interface CarSvgProps {
  className?: string;
}

export function CarSvg({ className = "" }: CarSvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="28" width="48" height="18" rx="4" fill="#e57373" />
      <path d="M16 28L22 16H42L48 28" fill="#e57373" stroke="#c62828" strokeWidth="2" strokeLinejoin="round" />
      <rect x="12" y="32" width="12" height="8" rx="2" fill="#bbdefb" />
      <rect x="40" y="32" width="12" height="8" rx="2" fill="#bbdefb" />
      <circle cx="18" cy="48" r="5" fill="#424242" />
      <circle cx="18" cy="48" r="2" fill="#757575" />
      <circle cx="46" cy="48" r="5" fill="#424242" />
      <circle cx="46" cy="48" r="2" fill="#757575" />
    </svg>
  );
}

interface FlowerSvgProps {
  className?: string;
}

export function FlowerSvg({ className = "" }: FlowerSvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="24" r="8" fill="#f5a623" />
      <ellipse cx="32" cy="12" rx="6" ry="8" fill="#e91e63" opacity="0.8" />
      <ellipse cx="32" cy="36" rx="6" ry="8" fill="#e91e63" opacity="0.8" />
      <ellipse cx="20" cy="24" rx="8" ry="6" fill="#e91e63" opacity="0.8" />
      <ellipse cx="44" cy="24" rx="8" ry="6" fill="#e91e63" opacity="0.8" />
      <ellipse cx="23" cy="17" rx="6" ry="5" fill="#e91e63" opacity="0.6" transform="rotate(-45 23 17)" />
      <ellipse cx="41" cy="17" rx="6" ry="5" fill="#e91e63" opacity="0.6" transform="rotate(45 41 17)" />
      <ellipse cx="23" cy="31" rx="6" ry="5" fill="#e91e63" opacity="0.6" transform="rotate(45 23 31)" />
      <ellipse cx="41" cy="31" rx="6" ry="5" fill="#e91e63" opacity="0.6" transform="rotate(-45 41 31)" />
      <rect x="30" y="36" width="4" height="22" rx="2" fill="#4caf50" />
      <ellipse cx="24" cy="50" rx="6" ry="3" fill="#4caf50" opacity="0.6" transform="rotate(-30 24 50)" />
      <ellipse cx="40" cy="48" rx="6" ry="3" fill="#4caf50" opacity="0.6" transform="rotate(30 40 48)" />
    </svg>
  );
}
