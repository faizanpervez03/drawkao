interface PawSvgProps {
  className?: string;
}

export function PawSvg({ className = "" }: PawSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main pad */}
      <ellipse cx="32" cy="40" rx="14" ry="12" fill="currentColor" />
      {/* Top left toe */}
      <ellipse cx="18" cy="24" rx="6" ry="7" fill="currentColor" transform="rotate(-15 18 24)" />
      {/* Top right toe */}
      <ellipse cx="46" cy="24" rx="6" ry="7" fill="currentColor" transform="rotate(15 46 24)" />
      {/* Middle left toe */}
      <ellipse cx="26" cy="18" rx="5" ry="6" fill="currentColor" transform="rotate(-5 26 18)" />
      {/* Middle right toe */}
      <ellipse cx="38" cy="18" rx="5" ry="6" fill="currentColor" transform="rotate(5 38 18)" />
    </svg>
  );
}
