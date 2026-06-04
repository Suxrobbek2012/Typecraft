interface KeyboardSVGProps {
  className?: string
}

export function KeyboardSVG({ className }: KeyboardSVGProps) {
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ]

  const accentKeys = ['T','Y','P','E']

  return (
    <svg
      viewBox="0 0 380 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Keyboard illustration"
    >
      {/* Keyboard body */}
      <rect x="8" y="28" width="364" height="180" rx="16" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5"/>
      <rect x="8" y="28" width="364" height="180" rx="16" fill="url(#kbGrad)" opacity="0.4"/>

      {/* Glow under keyboard */}
      <ellipse cx="190" cy="210" rx="140" ry="12" fill="var(--accent)" opacity="0.06"/>

      {/* Row 0 — number keys hint */}
      {[...Array(10)].map((_, i) => (
        <g key={i}>
          <rect
            x={20 + i * 34} y={38}
            width="28" height="20" rx="5"
            fill="var(--surface)" stroke="var(--border)" strokeWidth="1"
            opacity="0.5"
          />
        </g>
      ))}

      {/* Row 1 */}
      {rows[0].map((key, i) => {
        const isAccent = accentKeys.includes(key)
        return (
          <g key={key}>
            <rect
              x={20 + i * 34} y={66}
              width="30" height="30" rx="6"
              fill={isAccent ? 'var(--accent)' : 'var(--surface)'}
              stroke={isAccent ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={isAccent ? 0 : 1}
            >
              {isAccent && (
                <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
              )}
            </rect>
            <text
              x={35 + i * 34} y={86}
              textAnchor="middle"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="600"
              fill={isAccent ? '#0E0E10' : 'var(--text-sub)'}
            >
              {key}
            </text>
          </g>
        )
      })}

      {/* Row 2 */}
      {rows[1].map((key, i) => (
        <g key={key}>
          <rect
            x={37 + i * 34} y={104}
            width="30" height="30" rx="6"
            fill="var(--surface)" stroke="var(--border)" strokeWidth="1"
          />
          <text
            x={52 + i * 34} y={124}
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="600"
            fill="var(--text-sub)"
          >
            {key}
          </text>
        </g>
      ))}

      {/* Row 3 */}
      {rows[2].map((key, i) => (
        <g key={key}>
          <rect
            x={58 + i * 34} y={142}
            width="30" height="30" rx="6"
            fill="var(--surface)" stroke="var(--border)" strokeWidth="1"
          />
          <text
            x={73 + i * 34} y={162}
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="600"
            fill="var(--text-sub)"
          >
            {key}
          </text>
        </g>
      ))}

      {/* Space bar */}
      <rect x={90} y={180} width={200} height="20" rx="8"
        fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8"/>

      {/* Animated cursor pulse on spacebar */}
      <rect x={184} y={186} width="12" height="8" rx="2" fill="var(--accent)">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>

      {/* Floating WPM badge */}
      <g>
        <rect x="280" y="8" width="84" height="32" rx="10"
          fill="var(--accent)" opacity="0.95"/>
        <text x="322" y="20" textAnchor="middle" fontSize="8" fontFamily="monospace"
          fill="#0E0E10" opacity="0.7" fontWeight="500">WPM</text>
        <text x="322" y="34" textAnchor="middle" fontSize="14" fontFamily="monospace"
          fill="#0E0E10" fontWeight="700">148</text>
        <animate attributeName="y" values="8;4;8" dur="3s" repeatCount="indefinite"/>
      </g>

      {/* Floating accuracy badge */}
      <g>
        <rect x="12" y="8" width="84" height="32" rx="10"
          fill="var(--card)" stroke="var(--border)" strokeWidth="1" opacity="0.9"/>
        <text x="54" y="20" textAnchor="middle" fontSize="8" fontFamily="monospace"
          fill="var(--text-sub)" fontWeight="500">ACC</text>
        <text x="54" y="34" textAnchor="middle" fontSize="14" fontFamily="monospace"
          fill="var(--correct)" fontWeight="700">98%</text>
      </g>

      {/* Gradient def */}
      <defs>
        <linearGradient id="kbGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
