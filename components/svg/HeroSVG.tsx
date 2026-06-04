'use client'

export function HeroSVG() {
  return (
    <svg
      viewBox="0 0 600 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl mx-auto mb-6 opacity-60"
      aria-hidden="true"
    >
      {/* Text line 1 — correct chars */}
      {['t','h','e',' ','q','u','i','c','k',' ','b','r','o','w','n'].map((c, i) => (
        <text
          key={i}
          x={20 + i * 18}
          y={48}
          fontSize="15"
          fontFamily="monospace"
          fill={c === ' ' ? 'transparent' : 'var(--correct)'}
          fontWeight="500"
        >
          {c}
          {/* staggered fade-in */}
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.1s"
            begin={`${i * 0.04}s`}
            fill="freeze"
          />
        </text>
      ))}

      {/* Cursor */}
      <rect x={290} y={32} width="2" height="20" rx="1" fill="var(--accent)">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>

      {/* Text line 1 — pending chars */}
      {['f','o','x',' ','j','u','m','p','s',' ','o','v','e','r'].map((c, i) => (
        <text
          key={i}
          x={296 + i * 18}
          y={48}
          fontSize="15"
          fontFamily="monospace"
          fill="var(--text-sub)"
          opacity="0.5"
        >
          {c}
        </text>
      ))}

      {/* WPM live counter */}
      <g>
        <text x="20" y="95" fontSize="11" fontFamily="monospace" fill="var(--text-sub)" opacity="0.5">
          wpm
        </text>
        <text x="20" y="115" fontSize="28" fontFamily="monospace" fill="var(--accent)" fontWeight="700">
          142
          <animate attributeName="opacity" values="1;0.8;1" dur="1.5s" repeatCount="indefinite"/>
        </text>
      </g>

      {/* Accuracy */}
      <g>
        <text x="100" y="95" fontSize="11" fontFamily="monospace" fill="var(--text-sub)" opacity="0.5">
          acc
        </text>
        <text x="100" y="115" fontSize="28" fontFamily="monospace" fill="var(--correct)" fontWeight="700">
          98%
        </text>
      </g>

      {/* Mini progress bar */}
      <rect x="20" y="135" width="560" height="3" rx="1.5" fill="var(--muted)" opacity="0.4"/>
      <rect x="20" y="135" width="280" height="3" rx="1.5" fill="var(--accent)" opacity="0.7">
        <animate attributeName="width" values="0;280" dur="3s" fill="freeze"/>
      </rect>
    </svg>
  )
}
