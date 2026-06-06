/** Inline SVG icons used across the page. */

export const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h9M8 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const PlayTriangle = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14">
    <path d="M3 2l9 5-9 5z" fill="currentColor" />
  </svg>
)

export const PlaySmall = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <path d="M2 1l9 5-9 5z" />
  </svg>
)

export const MicIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
  </svg>
)

export const LinesIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
)

export const StarIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l2.2 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.8-.5z" />
  </svg>
)

export const Connector = () => (
  <svg
    className="connector"
    viewBox="0 0 26 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12h22M18 7l5 5-5 5" />
  </svg>
)

export const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#a9c2b6">
    <path d="M12 2l1.8 5.2L19 9l-4.5 3.3L16 18l-4-3-4 3 1.5-5.7L5 9l5.2-1.8z" />
  </svg>
)
