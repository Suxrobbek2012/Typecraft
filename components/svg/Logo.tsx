// TypeCraft SVG Logo — keyboard key with "TC" mark
export function TypeCraftLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TypeCraft logo"
    >
      {/* Outer key body */}
      <rect x="2" y="4" width="36" height="30" rx="6" fill="#0E0E10" stroke="#E8B84B" strokeWidth="1.8"/>
      {/* Key cap top highlight */}
      <rect x="5" y="7" width="30" height="20" rx="4" fill="#18181B"/>
      {/* Inner key shine */}
      <rect x="6" y="8" width="28" height="8" rx="3" fill="#E8B84B" opacity="0.07"/>

      {/* Letter T */}
      <text
        x="9"
        y="22"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="12"
        fontWeight="700"
        fill="#E8B84B"
        letterSpacing="-0.5"
      >T</text>

      {/* Letter C — slightly smaller, accent */}
      <text
        x="21"
        y="22"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="10"
        fontWeight="700"
        fill="#E8B84B"
        opacity="0.7"
      >C</text>

      {/* Bottom key stem */}
      <rect x="10" y="30" width="20" height="3" rx="1.5" fill="#E8B84B" opacity="0.25"/>

      {/* Accent dot — blinking caret metaphor */}
      <rect x="32" y="9" width="3" height="3" rx="0.5" fill="#E8B84B" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite"/>
      </rect>
    </svg>
  )
}

// Compact favicon-style logo (for small sizes)
export function TypeCraftIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="4" width="36" height="30" rx="6" fill="#0E0E10" stroke="#E8B84B" strokeWidth="2"/>
      <rect x="5" y="7" width="30" height="20" rx="4" fill="#18181B"/>
      <text x="9" y="22" fontFamily="monospace" fontSize="12" fontWeight="800" fill="#E8B84B">T</text>
      <text x="21" y="22" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#E8B84B" opacity="0.7">C</text>
      <rect x="10" y="30" width="20" height="3" rx="1.5" fill="#E8B84B" opacity="0.3"/>
    </svg>
  )
}
