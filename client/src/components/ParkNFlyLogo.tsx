// Park'n'Fly Logo — SVG component, no external assets, no whitespace issues
// Design: minimalist aviation mark — stylized "P" with integrated airplane silhouette
// Colors: navy (#1a2e4a) + sky blue (#3b82f6) accent

interface ParkNFlyLogoProps {
  /** Height of the logo in pixels */
  height?: number;
  /** Variant: 'color' (default) | 'white' (for dark backgrounds) */
  variant?: 'color' | 'white';
  /** Show text label next to icon */
  showText?: boolean;
  className?: string;
}

export function ParkNFlyLogo({
  height = 40,
  variant = 'color',
  showText = true,
  className = '',
}: ParkNFlyLogoProps) {
  const iconColor = variant === 'white' ? '#ffffff' : '#1a2e4a';
  const accentColor = variant === 'white' ? '#93c5fd' : '#3b82f6';
  const textColor = variant === 'white' ? '#ffffff' : '#1a2e4a';

  const iconSize = height;
  const textSize = Math.round(height * 0.55);
  const gap = Math.round(height * 0.3);

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${gap}px`, height: `${height}px` }}
    >
      {/* Icon: stylized "P" with airplane */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="20" fill={iconColor} />

        {/* Letter P — bold, geometric */}
        <path
          d="M11 10 L11 30 L14.5 30 L14.5 22 L19 22 C23.4 22 26.5 19.5 26.5 16 C26.5 12.5 23.4 10 19 10 Z M14.5 13 L18.5 13 C21.2 13 23 14.2 23 16 C23 17.8 21.2 19 18.5 19 L14.5 19 Z"
          fill="white"
        />

        {/* Airplane silhouette — small, top-right area */}
        <g transform="translate(22, 8) rotate(35)">
          {/* Fuselage */}
          <ellipse cx="0" cy="0" rx="4.5" ry="1.1" fill={accentColor} />
          {/* Left wing */}
          <path d="M-1 -0.5 L-3.5 -3.5 L0.5 -1.5 Z" fill={accentColor} />
          {/* Right wing */}
          <path d="M-1 0.5 L-3.5 3.5 L0.5 1.5 Z" fill={accentColor} />
          {/* Tail */}
          <path d="M-3.5 -0.3 L-5 -2 L-3.8 -0.1 Z" fill={accentColor} />
          <path d="M-3.5 0.3 L-5 2 L-3.8 0.1 Z" fill={accentColor} />
        </g>
      </svg>

      {/* Text */}
      {showText && (
        <span
          style={{
            fontSize: `${textSize}px`,
            fontWeight: 700,
            color: textColor,
            letterSpacing: '-0.02em',
            fontFamily: "'Sora', sans-serif",
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Park'n'Fly
        </span>
      )}
    </div>
  );
}
