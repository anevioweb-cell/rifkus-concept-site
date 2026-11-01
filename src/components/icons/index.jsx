/**
 * Inline SVG icons drawn for this project. All are decorative by default
 * (aria-hidden); give the parent control an accessible name instead.
 * Directional icons (arrow) must be mirrored by the caller in RTL.
 */
const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function ArrowIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon({ className = 'size-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon({ className = 'size-6' }) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function PlusIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PauseIcon({ className = 'size-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 5v14M15 5v14" />
    </svg>
  );
}

export function PlayIcon({ className = 'size-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M7 5l12 7-12 7z" />
    </svg>
  );
}

export function CheckIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function AlertIcon({ className = 'size-4' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}
