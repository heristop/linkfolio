/**
 * The project's comparison table and FAQ, owned in one place.
 *
 * Three surfaces render this: the /docs page (as HTML and FAQPage JSON-LD),
 * llms-full.txt (as plain text), and README.md (as markdown, written by
 * scripts/gen-readme.ts). They drifted before — the comparison lived in both
 * the README and LandingPage.tsx, and the FAQ existed only in the docs route,
 * so the README shipped without one. The 2026-08-14 spec logged that drift as
 * an accepted risk mitigated by discipline; this module replaces the
 * discipline with a single definition and a test.
 *
 * It imports nothing on purpose: scripts/gen-readme.ts runs it under plain
 * `node`, which resolves no path aliases and loads no framework.
 */

export type ComparisonColumn = {
  key: string;
  label: string;
  featured?: boolean;
};

export type ComparisonRow = {
  label: string;
  cells: Record<string, string>;
};

export type FaqEntry = { q: string; a: string };

/**
 * Named products rather than the previous "Hosted link-in-bio services".
 * A generic column matches no query anyone types and gives an answer engine
 * nothing to anchor a citation to. The unrelated products sharing this
 * project's name are deliberately absent — naming them would make this page
 * relevant to their brand queries, which is the opposite of what the
 * `sameAs` work in landingJsonLd.ts is for.
 */
export const COMPARISON_COLUMNS: ComparisonColumn[] = [
  { key: "linkfolio", label: "Linkfolio", featured: true },
  { key: "linktree", label: "Linktree" },
  { key: "linkstack", label: "LinkStack" },
  { key: "biolink", label: "Bio.link" },
];

/**
 * Every competitor cell was read off the page recorded in `SOURCES` on the
 * date recorded there. A cell nobody could verify is "—" rather than a guess:
 * a wrong claim about a named product is worse than an absent one. That is why
 * three rows are mostly dashes — neither linktr.ee nor bio.link publishes its
 * licence, its stack or where it stores data, so we say nothing about them.
 */
export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Cost",
    cells: {
      linkfolio: "Free, MIT licensed",
      // linktr.ee prices in the visitor's currency; € is what the page served
      // us, hence the explicit symbol rather than a bare number.
      linktree: "Free tier; paid from €4.50/mo billed annually",
      linkstack: "Free and open source; hosted from $1/mo",
      biolink: "One plan at $7.49/mo, 7-day free trial",
    },
  },
  {
    label: "Account required",
    cells: {
      linkfolio: "None",
      linktree: "Yes, a Linktree account",
      linkstack: "Yes, an account on the instance",
      biolink: "Yes, a Bio Link account",
    },
  },
  {
    label: "Open source",
    cells: {
      linkfolio: "Yes, MIT",
      linktree: "—",
      linkstack: "Yes, AGPL-3.0",
      biolink: "—",
    },
  },
  {
    label: "Your own domain",
    cells: {
      linkfolio: "Yes, you deploy it",
      // Quoting Linktree's own help centre, which is plainer than the pricing
      // page: "We don't offer the option to use a custom domain to replace the
      // linktr.ee URL."
      linktree: "No, pages live at linktr.ee/username",
      linkstack: "Yes, self-hosted or on the $5/mo plan",
      biolink: "Yes, on the paid plan",
    },
  },
  {
    label: "Where your data lives",
    cells: {
      linkfolio: "Your infrastructure",
      linktree: "—",
      linkstack: "Your own web server when self-hosted",
      biolink: "—",
    },
  },
  {
    label: "Built with",
    cells: {
      linkfolio: "Next.js and Tailwind CSS",
      linktree: "—",
      linkstack: "PHP and Laravel",
      biolink: "—",
    },
  },
];

/**
 * Where each competitor column's claims came from, and when. A product gets
 * more than one entry when one page could not carry every claim: Linktree's
 * pricing page never mentions domains, and LinkStack's licence and stack are
 * stated in its repository rather than on its site.
 *
 * bio.link/pricing is a member's profile page, not a pricing page — the plans
 * are on the home page, which is where the Bio.link cells were read.
 */
export const SOURCES = [
  {
    product: "Linktree",
    url: "https://linktr.ee/s/pricing",
    checked: "2026-08-17",
  },
  {
    product: "Linktree",
    url: "https://linktr.ee/help/en/articles/6571689-can-i-change-the-linktree-url-to-a-custom-domain",
    checked: "2026-08-17",
  },
  {
    product: "LinkStack",
    url: "https://linkstack.org/",
    checked: "2026-08-17",
  },
  {
    product: "LinkStack",
    url: "https://github.com/LinkStackOrg/LinkStack",
    checked: "2026-08-17",
  },
  { product: "Bio.link", url: "https://bio.link/", checked: "2026-08-17" },
];

/** Seeded from the FAQ that shipped in app/docs/page.tsx. */
export const FAQ: FaqEntry[] = [
  {
    q: "Is Linkfolio free?",
    a: "Yes. Linkfolio is open source under the MIT licence. You host it yourself, so there is no subscription and no usage limit.",
  },
  {
    q: "How is it different from Linktree?",
    a: "Linkfolio runs on your own domain and infrastructure. You have full access to the source, can inject your own React components, and no third party sits between you and your visitors.",
  },
  {
    q: "Do I need to know Next.js to use it?",
    a: "No. You can deploy the template to Vercel in one click and personalise it by editing a single configuration file. Knowing Next.js helps if you want to customise components.",
  },
  {
    q: "Can I add it to an existing Next.js project?",
    a: "Yes. Install the linkfolio package and render the LinkFolio component with your own config object.",
  },
  {
    q: "Can I use Google Analytics with Linkfolio?",
    a: 'Yes, and it is not the only option. Set analytics: { provider: "ga", id: "G-…" } in your config and Linkfolio loads the tag and reports which link each visitor clicked. Google Tag Manager, Plausible and Umami ship as built-in providers too, you can register your own, and every link card emits a linkfolio:analytics DOM event you can listen to without configuring any provider at all.',
  },
];

/**
 * This is written straight into README.md by scripts/gen-readme.ts, and
 * README.md is also owned by the repo's formatter (oxfmt runs on `*.md` via
 * lint-staged). oxfmt's markdown convention is a column-padded table, so an
 * unpadded table here would get re-padded by the next commit that touches
 * README.md — and that would break the byte-for-byte comparison in
 * tests/unit/readme-sync.spec.ts on an otherwise unrelated change. Emitting
 * the padded form directly means the generator's output already is the
 * formatter's canonical form, so the two never fight over the file.
 */
export function renderComparisonMarkdown(): string {
  const headerCells = ["", ...COMPARISON_COLUMNS.map((c) => c.label)];
  const rows = COMPARISON_ROWS.map((row) => [
    row.label,
    ...COMPARISON_COLUMNS.map((c) => row.cells[c.key]),
  ]);

  const widths = headerCells.map((cell, i) =>
    Math.max(cell.length, 3, ...rows.map((row) => row[i].length)),
  );

  const renderRow = (cells: string[]) =>
    `| ${cells.map((cell, i) => cell.padEnd(widths[i], " ")).join(" | ")} |`;

  const header = renderRow(headerCells);
  const divider = `| ${widths.map((w) => "-".repeat(w)).join(" | ")} |`;
  const body = rows.map((row) => renderRow(row));

  return [header, divider, ...body].join("\n");
}

export function renderFaqMarkdown(): string {
  return FAQ.map((entry) => `### ${entry.q}\n\n${entry.a}`).join("\n\n");
}

/**
 * The llms-full.txt rendering. Plain prose rather than a markdown table:
 * the consumer is a language model reading for facts, and a pipe-delimited
 * grid loses its column headings the moment it is chunked.
 */
export function renderContentPlainText(): string {
  const comparison = COMPARISON_ROWS.map((row) => {
    const cells = COMPARISON_COLUMNS.map(
      (c) => `${c.label}: ${row.cells[c.key]}`,
    ).join("; ");

    return `- ${row.label} — ${cells}`;
  }).join("\n");

  const faq = FAQ.map((entry) => `Q: ${entry.q}\nA: ${entry.a}`).join("\n\n");

  const sources = SOURCES.map(
    (s) => `- ${s.product}: ${s.url} (checked ${s.checked})`,
  ).join("\n");

  return `## How Linkfolio compares\n\n${comparison}\n\nComparison sources:\n${sources}\n\n## Frequently asked questions\n\n${faq}`;
}
