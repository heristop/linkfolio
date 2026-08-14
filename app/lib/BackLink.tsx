import Link from "next/link";
import { ArrowLeftIcon } from "./icons";

/**
 * One "back to home" (or "back to X") treatment, reused everywhere the app
 * offers that exact affordance: the docs page, and the back-home action on
 * each status page (404 / 500 / 400). The icon, `.lf-nudge` hover lean,
 * 44px target, focus ring and `next/link` usage are shared unconditionally —
 * only emphasis varies, via `variant`, because "back to home" is not always
 * the same *rank* of action on every page:
 *
 * - `variant="ghost"` (default): bordered, muted-to-primary text. Used
 *   wherever another action on the page already owns the primary role (docs'
 *   prose flow has no competing action either, so it stays ghost there too;
 *   the 500 page's "Try again" is the primary recovery there, so back-home
 *   stays subordinate).
 * - `variant="primary"`: composes the same filled treatment as
 *   `ACTION_PRIMARY_CLASS` (`.lf-cta`, `bg-primary`). Used where nothing else
 *   competes for the primary role and back-home genuinely *is* the page's
 *   main recovery path (404, 400 — there is no retry action there, just a
 *   broken address).
 *
 * A page should have exactly one primary action. `.lf-nudge` layers the
 * directional hover lean on top of whichever base treatment is chosen (see
 * globals.css ~L965, "Nav links lean toward where they lead") — the base
 * treatment's own border/fill/active/spring rules do the rest; nothing here
 * redeclares them.
 */
const BASE_CLASS =
  "lf-nudge inline-flex min-h-11 items-center gap-1.5 rounded-md px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const VARIANT_CLASS = {
  ghost:
    "lf-cta-ghost border border-primary/20 text-(--lf-description-color) hover:text-primary",
  primary:
    "lf-cta bg-primary text-background-start hover:text-background-start",
} as const;

export type BackLinkProps = {
  href: string;
  label: string;
  variant?: keyof typeof VARIANT_CLASS;
};

export default function BackLink({
  href,
  label,
  variant = "ghost",
}: Readonly<BackLinkProps>) {
  return (
    <Link href={href} className={`${BASE_CLASS} ${VARIANT_CLASS[variant]}`}>
      <ArrowLeftIcon />
      {label}
    </Link>
  );
}
