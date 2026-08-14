/**
 * Guards for config values that end up in a raw HTML/CSS sink.
 *
 * A config authored in TypeScript is already safe, but consumers may feed
 * `userConfig` from a CMS, a JSON file or plain JavaScript, where nothing has
 * been checked. These helpers keep such values from escaping their context.
 */

const JSON_ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const JSON_UNSAFE = /[<>&\u2028\u2029]/g;

const LINKABLE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Paths and fragments carry no protocol, so they can never be a script URL. */
const RELATIVE_PREFIXES = ["/", "#", "?"];

/**
 * `//host` is protocol-relative and leaves the origin, so it is not a path
 * however much it looks like one. Backslashes are included because browsers
 * normalise `/\` and `\/` to the same thing.
 */
const PROTOCOL_RELATIVE = /^[/\\]{2}/;

const CSS_IDENTIFIER = /^[a-zA-Z][\w-]*$/;

/**
 * Measurement and container ids land inside an inline `<script>`, where a
 * quote or an angle bracket ends the string or the tag. Real ids across every
 * vendor are alphanumerics, dots, dashes and underscores — so allow-list that
 * and reject the rest rather than trying to escape it.
 */
const ANALYTICS_ID = /^[\w.-]+$/;

/** `;` and `}` end a declaration or block, `@` starts an at-rule. */
const CSS_VALUE_UNSAFE = /[;{}<>@\\]/;

/**
 * Escape a JSON string for embedding in a `<script>` element.
 *
 * `JSON.stringify` leaves `<` and `/` untouched, so a value containing
 * `</script>` would otherwise close the tag and execute what follows.
 */
export function escapeJsonLd(json: string): string {
  return json.replace(JSON_UNSAFE, (char) => JSON_ESCAPES[char] ?? char);
}

/**
 * Return `url` when it is safe to use as an `href`, `"#"` otherwise.
 *
 * Parsing rather than pattern matching is deliberate: the URL parser strips
 * the tabs and newlines that defeat a naive `javascript:` check.
 */
export function safeUrl(url: string | undefined | null): string {
  // An unchecked config can omit `url` entirely, and every caller renders the
  // result into an `href` — so a missing value degrades to the same inert
  // fragment as a rejected one rather than throwing mid-render.
  const trimmed = typeof url === "string" ? url.trim() : "";

  if (trimmed.length === 0 || PROTOCOL_RELATIVE.test(trimmed)) {
    return "#";
  }

  if (RELATIVE_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    return trimmed;
  }

  try {
    const { protocol } = new URL(trimmed, "https://linkfolio.invalid");

    return LINKABLE_PROTOCOLS.has(protocol) ? trimmed : "#";
  } catch {
    return "#";
  }
}

/** Whether `url` is an absolute http(s) URL, the only kind worth publishing. */
export function isPublicUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url.trim());

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Whether `name` is usable as a custom property name without quoting. */
export function isSafeCssIdentifier(name: string): boolean {
  return CSS_IDENTIFIER.test(name);
}

/** Whether `value` stays inside its declaration instead of ending it. */
export function isSafeCssValue(value: string): boolean {
  return value.length > 0 && !CSS_VALUE_UNSAFE.test(value);
}

/**
 * Whether `value` stays inside the string literal it is interpolated into.
 *
 * Scoped to that one sink: `.`, `-` and repeated dots are allowed because
 * they are inert there, but the same value is not guaranteed safe if a
 * future adapter interpolates it into a URL path or uses it as an object
 * key — `..` and `__proto__` both pass this check.
 */
export function isSafeAnalyticsId(value: string): boolean {
  return ANALYTICS_ID.test(value);
}
