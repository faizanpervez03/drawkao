interface StarSvgProps {
  className?: string;
}

export function StarSvg({ className = "" }: StarSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 4L40 22L60 24L46 38L50 58L32 48L14 58L18 38L4 24L24 22L32 4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Shine */}
      <path
        d="M24 24L28 20L32 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}
