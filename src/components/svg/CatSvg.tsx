interface CatSvgProps {
  className?: string;
}

export function CatSvg({ className = "" }: CatSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cat face */}
      <circle cx="32" cy="36" r="20" fill="#ff9800" stroke="#e65100" strokeWidth="2" />
      {/* Left ear */}
      <path
        d="M14 28L18 10L28 24"
        fill="#ff9800"
        stroke="#e65100"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left ear inner */}
      <path
        d="M18 24L20 14L26 22"
        fill="#ffcc80"
        stroke="none"
      />
      {/* Right ear */}
      <path
        d="M50 28L46 10L36 24"
        fill="#ff9800"
        stroke="#e65100"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right ear inner */}
      <path
        d="M46 24L44 14L38 22"
        fill="#ffcc80"
        stroke="none"
      />
      {/* Left eye */}
      <circle cx="24" cy="34" r="4" fill="white" />
      <circle cx="25" cy="34" r="2.5" fill="#2d2d2d" />
      <circle cx="26" cy="33" r="1" fill="white" />
      {/* Right eye */}
      <circle cx="40" cy="34" r="4" fill="white" />
      <circle cx="41" cy="34" r="2.5" fill="#2d2d2d" />
      <circle cx="42" cy="33" r="1" fill="white" />
      {/* Nose */}
      <path
        d="M32 40L30 42L34 42Z"
        fill="#e91e63"
        stroke="none"
      />
      {/* Mouth */}
      <path
        d="M32 42C32 42 28 46 26 44"
        stroke="#e65100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M32 42C32 42 36 46 38 44"
        stroke="#e65100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Whiskers left */}
      <path d="M12 36L22 38" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 40L22 40" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 44L22 42" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers right */}
      <path d="M52 36L42 38" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 40L42 40" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 44L42 42" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
