# Layouts

The classic list and the bento mosaic, and how tile sizing works.

## Layouts

`classic` (the default) renders one centred, wrapping row per link group.
`bento` merges every group into a single mosaic grid and takes each tile's
size from the `group` the link already declares:

| `group`       | Default tile  |
| ------------- | ------------- |
| `project`     | `2x2` — large |
| `website`     | `2x1` — wide  |
| anything else | `1x1` — small |

Any link can override that with its own `span`, read as **columns x rows**:
`"1x1"`, `"2x1"`, `"1x2"`, `"2x2"` or `"2x3"`. A second field, `direction`,
sets how the card arranges its own contents — `"vertical"` stacks the image
above the title, `"horizontal"` sets them side by side (the default for a
one-row-tall wide tile, which has no vertical room for both):

```javascript
socialNetworks: [
  { url: "...", title: "Portfolio", group: "website", span: "2x2" },
  { url: "...", title: "GitHub", span: "1x2" },
  { url: "...", title: "YouTube", span: "2x1", direction: "horizontal" },
  { url: "...", title: "X" }, // no span: 1x1, from its group
];
```

Both fields are ignored by the classic layout, so adding them costs nothing if
you switch back.

```javascript
const userConfig = {
  // ... other configurations
  layout: "bento",
};
```

Nothing needs annotating to start — an existing `socialNetworks` array becomes
a bento as it stands, because every link already has a group.

Tiles are ordered so the sizes alternate: config files list links group by
group, and honouring that order would produce bands of identical tiles rather
than a mosaic. Relative order within one size is preserved. The grid drops to
two columns under 768px, where every wide and large tile takes a full row.

A `horizontal` card carries a resting surface, since side by side a short
caption can leave enough space between the two halves to read as two separate
things. Four CSS custom properties tune all of this: `--lf-bento-columns`
(default `4`), `--lf-bento-row` (default `8rem`, the height of one small
tile), and `--lf-bento-tile-bg` / `--lf-bento-tile-hover-bg`, both mixed from
`--color-primary` so they follow the palette in either mode.

Example of adding the typewriter effect on the alias:

```javascript
const userConfig = {
  // ... other configurations
  enableTypingAlias: true,
};
```

---

[← Back to the README](../README.md)
