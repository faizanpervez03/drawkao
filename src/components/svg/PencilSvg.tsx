interface PencilSvgProps {
  className?: string;
}

export function PencilSvg({ className = "" }: PencilSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pencil body */}
      <rect x="22" y="8" width="20" height="40" rx="2" fill="#f5a623" stroke="#e65100" strokeWidth="2" />
      {/* Pencil stripes */}
      <rect x="22" y="16" width="20" height="4" fill="#ffb74d" />
      <rect x="22" y="28" width="20" height="4" fill="#ffb74d" />
      {/* Pencil tip */}
      <path
        d="M22 48L32 60L42 48"
        fill="#795548"
        stroke="#4e342e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pencil tip point */}
      <path
        d="M30 54L32 60L34 54"
        fill="#2d2d2d"
        stroke="none"
      />
      {/* Eraser */}
      <rect x="22" y="4" width="20" height="6" rx="2" fill="#e91e63" stroke="#c2185b" strokeWidth="1.5" />
      {/* Eraser band */}
      <rect x="22" y="8" width="20" height="3" fill="#9e9e9e" />
    </svg>
  );
}
