interface AppleSvgProps {
  className?: string;
}

export function AppleSvg({ className = "" }: AppleSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Apple body */}
      <path
        d="M32 58C32 58 12 48 12 28C12 16 20 8 32 8C44 8 52 16 52 28C52 48 32 58 32 58Z"
        fill="#e57373"
        stroke="#c62828"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Apple indent */}
      <path
        d="M32 8C32 8 28 12 28 18"
        stroke="#c62828"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Leaf */}
      <path
        d="M32 8C32 8 38 4 44 6C44 6 40 10 32 8Z"
        fill="#4caf50"
        stroke="#2e7d32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <path
        d="M32 8C32 8 30 4 32 2"
        stroke="#795548"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Shine */}
      <path
        d="M22 24C22 24 24 20 28 22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
