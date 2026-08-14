/**
 * Shared icon set for app-level chrome (status pages, docs, and anywhere
 * else outside `src/`, the published package). Keeping these here — rather
 * than local to whichever component first needed one — is what stops the
 * same glyph being redrawn slightly differently in two places, which reads
 * as two icon families rather than one.
 */

export function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
