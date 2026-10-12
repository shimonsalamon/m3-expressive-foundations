# Color

Material 3 color is a set of named **roles** (primary, on-primary, surface-container-high, ...). A **scheme** fills
those roles with values: the static baseline, a brand scheme, or a scheme generated from one source color.
Components ask for roles and never for hex values, so the same stylesheet works in light and dark themes, at three
contrast levels, and with any seed. M3 Expressive kept the role set as it was. What it added: the three contrast
levels became tokens, and designers are asked to use accent-role and surface-tone contrast on purpose to rank what
matters on a screen.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [Color roles and pairing rules](#color-roles-and-pairing-rules)
- [Choosing roles for emphasis (the expressive color tactic)](#choosing-roles-for-emphasis-the-expressive-color-tactic)
  - [A grouped list screen (settings)](#a-grouped-list-screen-settings)
- [Contrast levels](#contrast-levels)
- [HCT and tonal palettes](#hct-and-tonal-palettes)
- [Static baseline, brand schemes and custom colors](#static-baseline-brand-schemes-and-custom-colors)
- [Dynamic color](#dynamic-color)
- [MCU color spec 2021 vs 2025](#mcu-color-spec-2021-vs-2025)
- [Applying it on the web](#applying-it-on-the-web)
  - [Appearance settings](#appearance-settings)
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **Roles, not colors.** Every element gets a role. The value behind a role changes with theme, contrast level and
  scheme, and the name stays the same. Hard-coded hex values or palette tones break the moment any of those change.
- **Pairs are the accessibility contract.** Each `on-X` role is tuned to stay legible on `X` at every theme and
  contrast level. No other combination has that guarantee, even when it happens to look fine in one context.
- **Accent families rank importance.** Primary is for the most important thing, secondary for quieter actions and
  selections, and tertiary for a contrasting accent. Error is a semantic red that stays red in every scheme. Changing
  role assignments only to get a different hue throws that ranking away.
- **Neutral surfaces build structure with tone.** The page sits on `surface`. Regions sit on one of five
  surface-container tones, plus `surface-dim` and `surface-bright`. Separation comes from tonal difference, not
  from tinted overlays or (by default) shadows.
- **Contrast is a user setting.** Standard, medium and high levels exist for both themes, which gives six value sets
  per role. A UI built only from correct role pairs supports all six with no extra work.
- **Tone predicts contrast.** Schemes are built in HCT, where tone equals perceptual lightness (L*). A tone gap
  guarantees a minimum contrast ratio for any hue, which is why generated schemes stay accessible for any seed.
- **Web status.** Material Web is in maintenance mode, and Material has not implemented M3 Expressive on the web.
  This skill ships `assets/m3-expressive-tokens.css` (the 3P baseline). For any other scheme, run
  `scripts/generate-scheme.mjs` at build time, or call `@material/material-color-utilities` (MCU) at runtime. Both
  emit the same custom properties.

## What M3 Expressive changed

| Area | Status | What to know |
|---|---|---|
| Role set | Unchanged | No role was added or renamed. The newest roles (the fixed family) date from Feb 2023; surface containers and dim/bright arrived in Feb/Mar 2023. |
| Contrast levels | Changed, May 2025 | Every color role now has a documented standard, medium and high value, published as tokens. Contrast themes existed earlier in MCU and Material Theme Builder (since 2023), but not as published tokens. |
| On-container tone (light theme) | Changed, Aug 2024 (all of M3, before Expressive) | `on-primary-container`, `on-secondary-container`, `on-tertiary-container` and `on-error-container` moved from tone 10 to tone 30 (e.g. `#21005D` became `#4F378B`) to add color while staying accessible. Compose `expressiveLightColorScheme()`, the `MaterialExpressiveTheme` default, uses tone 30. Compose `lightColorScheme()` and MDC-Android 34.0.0 still ship tone 10. The token file uses tone 30. |
| Color tactics | New guidance | Mix accent families and surface tones to make the key element stand out, and give the most important content the brightest surface. See [Choosing roles for emphasis](#choosing-roles-for-emphasis-the-expressive-color-tactic). |
| Color motion | New with Expressive motion | Color and opacity changes animate on the *effects* springs, which never overshoot. Button color and state-layer changes use the fast one. |
| Device dynamic color | Platform change, not a token change | A third-party report quotes Google saying Android 16 QPR1 dynamic color has more variation and higher chroma. Wear OS derives colors from the two most common watch-face hues. Neither changes web tokens. |
| MCU "2025" color spec | New in the library; Material documents no link to Expressive | The published tokens and all color pages still follow the 2021 spec. See [MCU color spec 2021 vs 2025](#mcu-color-spec-2021-vs-2025). |
| Web | No official implementation | Material Web Components are in maintenance mode and do not implement M3 Expressive. |
| Naming trap | Predates M3 Expressive | MCU's `SchemeExpressive` / `Variant.EXPRESSIVE` is a scheme variant (2022) that pulls away from the seed hue. An M3 Expressive product does not need it. |

## Color roles and pairing rules

### Vocabulary

| Word in the role name | Meaning |
|---|---|
| `primary`, `secondary`, `tertiary` | Accent families, ranked by emphasis. |
| `error` | Semantic family for errors. It stays red in every scheme and still adapts to theme and contrast. |
| `surface` | Backgrounds and large low-emphasis areas (neutral palette). |
| `-container` | A fill for a foreground element such as a button or chip. It is never a text or icon color. |
| `on-` | Text and icons drawn on the role it names. |
| `-variant` | A lower-emphasis alternative to the role without the suffix. |
| `-fixed`, `-fixed-dim` | Accent fills that keep the same tone in light and dark (add-on roles). |
| `-dim`, `-bright` (surfaces) | The dimmest and brightest of the plain surfaces, in both themes. |
| `inverse-` | Reversed colors for an island that contrasts with the surrounding UI. |

Material counts 26 standard roles in six groups (primary, secondary, tertiary, error, surface, outline). The full set
is 45 once you add inverse, fixed, dim/bright, scrim and shadow. The token database also keeps 5 legacy tokens. The
token file emits 49 `--md-sys-color-*` properties and omits only the deprecated `surface-tint-color`.

### Accent and error roles

Values are the 3P baseline at standard contrast, written as light / dark, with the palette tone in parentheses
(P = primary palette). Secondary, tertiary and error use the same tones as primary: 40/80, 100/20, 90/30, 30/90.

| Token | CSS custom property | Light / dark (standard) | Use |
|---|---|---|---|
| md.sys.color.primary | `--md-sys-color-primary` | `#6750A4` (P40) / `#D0BCFF` (P80) | The highest-emphasis fill; accent text and icons on surfaces; active states |
| md.sys.color.on-primary | `--md-sys-color-on-primary` | `#FFFFFF` (P100) / `#381E72` (P20) | Text and icons on `primary` |
| md.sys.color.primary-container | `--md-sys-color-primary-container` | `#EADDFF` (P90) / `#4F378B` (P30) | A prominent but softer fill for key components |
| md.sys.color.on-primary-container | `--md-sys-color-on-primary-container` | `#4F378B` (P30) / `#EADDFF` (P90) | Text and icons on `primary-container` |
| md.sys.color.inverse-primary | `--md-sys-color-inverse-primary` | `#D0BCFF` (P80) / `#6750A4` (P40) | An action (e.g. a text link) on `inverse-surface` |
| md.sys.color.secondary | `--md-sys-color-secondary` | `#625B71` / `#CCC2DC` | Quieter accents |
| md.sys.color.on-secondary | `--md-sys-color-on-secondary` | `#FFFFFF` / `#332D41` | Text and icons on `secondary` |
| md.sys.color.secondary-container | `--md-sys-color-secondary-container` | `#E8DEF8` / `#4A4458` | Recessive fills: tonal buttons, selected indicators, filter chips |
| md.sys.color.on-secondary-container | `--md-sys-color-on-secondary-container` | `#4A4458` / `#E8DEF8` | Text and icons on `secondary-container` |
| md.sys.color.tertiary | `--md-sys-color-tertiary` | `#7D5260` / `#EFB8C8` | A contrasting accent that balances primary and secondary or calls attention to a small element |
| md.sys.color.on-tertiary | `--md-sys-color-on-tertiary` | `#FFFFFF` / `#492532` | Text and icons on `tertiary` |
| md.sys.color.tertiary-container | `--md-sys-color-tertiary-container` | `#FFD8E4` / `#633B48` | Contrasting fill, e.g. a badge or highlighted field |
| md.sys.color.on-tertiary-container | `--md-sys-color-on-tertiary-container` | `#633B48` / `#FFD8E4` | Text and icons on `tertiary-container` |
| md.sys.color.error | `--md-sys-color-error` | `#B3261E` / `#F2B8B5` | Error text, icons and strokes |
| md.sys.color.on-error | `--md-sys-color-on-error` | `#FFFFFF` / `#601410` | Text and icons on `error` |
| md.sys.color.error-container | `--md-sys-color-error-container` | `#F9DEDC` / `#8C1D18` | Error fill (e.g. an error banner) |
| md.sys.color.on-error-container | `--md-sys-color-on-error-container` | `#8C1D18` / `#F9DEDC` | Text and icons on `error-container` |

### Surface roles

N is the neutral palette and NV the neutral-variant palette.

| Token | CSS custom property | Light / dark (standard) | Use |
|---|---|---|---|
| md.sys.color.surface | `--md-sys-color-surface` | `#FEF7FF` (N98) / `#141218` (N6) | The default page background |
| md.sys.color.surface-dim | `--md-sys-color-surface-dim` | `#DED8E1` (N87) / `#141218` (N6) | A region that should recede in both themes |
| md.sys.color.surface-bright | `--md-sys-color-surface-bright` | `#FEF7FF` (N98) / `#3B383E` (N24) | A region that should come forward in both themes |
| md.sys.color.surface-container-lowest | `--md-sys-color-surface-container-lowest` | `#FFFFFF` (N100) / `#0F0D13` (N4) | Lowest-emphasis container: a touch brighter than `surface` in light, a touch darker in dark |
| md.sys.color.surface-container-low | `--md-sys-color-surface-container-low` | `#F7F2FA` (N96) / `#1D1B20` (N10) | Low-emphasis containers (e.g. elevated cards) |
| md.sys.color.surface-container | `--md-sys-color-surface-container` | `#F3EDF7` (N94) / `#211F26` (N12) | The default contained area on `surface` (e.g. navigation regions) |
| md.sys.color.surface-container-high | `--md-sys-color-surface-container-high` | `#ECE6F0` (N92) / `#2B2930` (N17) | Higher-emphasis containers (e.g. dialogs) |
| md.sys.color.surface-container-highest | `--md-sys-color-surface-container-highest` | `#E6E0E9` (N90) / `#36343B` (N22) | Strongest container tone (e.g. text-field fills, off-state tracks) |
| md.sys.color.on-surface | `--md-sys-color-on-surface` | `#1D1B20` (N10) / `#E6E0E9` (N90) | Main text and icons on any surface or container |
| md.sys.color.on-surface-variant | `--md-sys-color-on-surface-variant` | `#49454F` (NV30) / `#CAC4D0` (NV80) | Secondary text, icons, and inactive-state content on any surface |

The component mappings in the Use column are Material's defaults, shown only as examples. You may remap them, as long
as the same region keeps the same role at every window size.

`surface` swaps sides between themes: it is the brightest plain surface in light and the dimmest in dark.
`surface-dim` and `surface-bright` keep their meaning in both themes. In the baseline, `surface-bright` equals
`surface` in light and `surface-dim` equals `surface` in dark. Note also that `surface-container-lowest` (`#FFFFFF`)
is brighter than `surface-bright` in light. Read "dim" and "bright" as relative to `surface`, not to every container.

### Inverse, outline, scrim, shadow

| Token | CSS custom property | Light / dark (standard) | Use |
|---|---|---|---|
| md.sys.color.inverse-surface | `--md-sys-color-inverse-surface` | `#322F35` (N20) / `#E6E0E9` (N90) | A reversed island, such as a snackbar or toast |
| md.sys.color.inverse-on-surface | `--md-sys-color-inverse-on-surface` | `#F5EFF7` (N95) / `#322F35` (N20) | Text and icons on `inverse-surface` |
| md.sys.color.outline | `--md-sys-color-outline` | `#79747E` (NV50) / `#938F99` (NV60) | Boundaries that matter: text-field borders, edges of targets |
| md.sys.color.outline-variant | `--md-sys-color-outline-variant` | `#CAC4D0` (NV80) / `#49454F` (NV30) | Decorative lines: dividers, card borders, and borders of controls whose content already has 4.5:1 |
| md.sys.color.scrim | `--md-sys-color-scrim` | `#000000` | The layer under modals. Apply it at 32%; the helper `--m3e-scrim` already does. |
| md.sys.color.shadow | `--md-sys-color-shadow` | `#000000` | Shadow color; the shadow helpers `--m3e-elevation-shadow-level1` to `level5` use it (`level0` is `none`) |

`outline` is 4.33:1 (light) and 5.87:1 (dark) against `surface`, so it can carry a target boundary.
`outline-variant` is only 1.62:1 and 1.99:1, so it must never be the only thing that shows where a control is.

### Add-on roles: fixed and fixed-dim

These fills keep the same tone in light and dark. Most products do not need them: reach for them only when an
element has to look identical in both themes. They do not adapt to the theme, so never use them where contrast
against the surrounding surface carries meaning; use the regular accent roles there instead.

| Token | CSS custom property | Light and dark (standard) | Use |
|---|---|---|---|
| md.sys.color.primary-fixed | `--md-sys-color-primary-fixed` | `#EADDFF` (P90) | A fill that does not change with the theme; can replace `primary-container` |
| md.sys.color.primary-fixed-dim | `--md-sys-color-primary-fixed-dim` | `#D0BCFF` (P80) | A stronger fixed fill (tone 80, one step darker) |
| md.sys.color.on-primary-fixed | `--md-sys-color-on-primary-fixed` | `#21005D` (P10) | Text and icons on either fixed fill |
| md.sys.color.on-primary-fixed-variant | `--md-sys-color-on-primary-fixed-variant` | `#4F378B` (P30) | Lower-emphasis text and icons on either fixed fill |
| md.sys.color.secondary-fixed / -fixed-dim | `--md-sys-color-secondary-fixed`, `--md-sys-color-secondary-fixed-dim` | `#E8DEF8` / `#CCC2DC` | As above |
| md.sys.color.on-secondary-fixed / -fixed-variant | `--md-sys-color-on-secondary-fixed`, `--md-sys-color-on-secondary-fixed-variant` | `#1D192B` / `#4A4458` | As above |
| md.sys.color.tertiary-fixed / -fixed-dim | `--md-sys-color-tertiary-fixed`, `--md-sys-color-tertiary-fixed-dim` | `#FFD8E4` / `#EFB8C8` | As above |
| md.sys.color.on-tertiary-fixed / -fixed-variant | `--md-sys-color-on-tertiary-fixed`, `--md-sys-color-on-tertiary-fixed-variant` | `#31111D` / `#633B48` | As above |

"Fixed" holds only at standard contrast. In the light theme at medium and high contrast, `primary-fixed` becomes
`#6750A4` and then `#4F378B`, and `on-primary-fixed` becomes white. In the dark theme the fixed fills keep their
values but their on-colors change. Sources also disagree about whether `-fixed-dim` is stronger or weaker. The roles
page calls it more emphasized, and it is darker (tone 80 vs 90), so this skill follows the roles page.

### Legacy roles

| Token | CSS custom property | Light / dark (standard) | Status |
|---|---|---|---|
| md.sys.color.surface-tint | `--md-sys-color-surface-tint` | `var(--md-sys-color-primary)` | Deprecated. It used to tint elevated surfaces with a primary overlay. Kept only for legacy code. |
| md.sys.color.surface-variant | `--md-sys-color-surface-variant` | `#E7E0EC` (NV90) / `#49454F` (NV30) | Legacy: dropped from the roles page in 2023, though the token is still active. Use `surface-container-highest` (a different value: N90 / N22). |
| md.sys.color.background | `--md-sys-color-background` | `#FEF7FF` / `#141218` | Legacy. Equals `surface`, so use `surface`. |
| md.sys.color.on-background | `--md-sys-color-on-background` | `#1D1B20` / `#E6E0E9` | Legacy. Equals `on-surface` at every level. |
| md.sys.color.surface-tint-color | (not emitted) | alias of surface-tint | Deprecated alias |

Moving from tint overlays (2023): elevation +1 maps to `surface-container-low`, +2 to `surface-container`, +3 to
`surface-container-high`, and +4/+5 to `surface-container-highest`. `surface-variant` maps to
`surface-container-highest`. Compose still exposes the old overlay formula, alpha = (4.5 · ln(dp + 1) + 2) / 100 of
the tint over `surface`. Use it only to match a legacy design, never for new work.

### Pairing matrix

| Background (fill) | Text and icons allowed on it |
|---|---|
| `primary` | `on-primary` |
| `primary-container` | `on-primary-container` |
| `secondary` / `secondary-container` | `on-secondary` / `on-secondary-container` |
| `tertiary` / `tertiary-container` | `on-tertiary` / `on-tertiary-container` |
| `error` / `error-container` | `on-error` / `on-error-container` |
| `surface`, `surface-dim`, `surface-bright`, any `surface-container-*` | `on-surface` (main), `on-surface-variant` (secondary). Accent roles `primary`, `secondary`, `tertiary` and `error` also work as text or icon colors here (at least 4.61:1 in the baseline, lowest on `surface-dim` in light). |
| `inverse-surface` | `inverse-on-surface`; `inverse-primary` for an action |
| `X-fixed`, `X-fixed-dim` | `on-X-fixed` (main), `on-X-fixed-variant` (lower emphasis) |

Wrong pairs can pass in one context and fail in another, which is why they slip through reviews. Baseline examples:

- `primary` text on `primary-container` is 5.00:1 at standard contrast in light, but 1.45:1 at medium.
- `on-surface` text on `secondary-container` is fine at standard, but falls to 3.25:1 at medium and 2.26:1 at high,
  because the container turns dark and `on-surface` turns black.

`outline` and `outline-variant` are stroke colors, not fills. The scrim has no content of its own: the modal above it
brings its own surface and pairing.

## Choosing roles for emphasis (the expressive color tactic)

M3 Expressive asks for richer, deliberate color: make the main takeaway or key action differ clearly from its
surroundings, and step everything else down. The tools are the contrast between accent families (primary vs
secondary vs tertiary) and the contrast between surface tones. Without that difference, the important element blends
into the rest.

**Emphasis ladder (strongest first).** This ladder is this skill's ordering of the role descriptions on the roles
page; Material publishes no such table. Choose the lowest rung that still does the job, and keep the top rungs rare.

| Rung | Fill / content | Typical use |
|---|---|---|
| 1 | `primary` / `on-primary` | The single most important action or state in a region |
| 2 | `primary-container` / `on-primary-container` | A key component that should stand out without shouting |
| 3 | `tertiary-container` / `on-tertiary-container` (or `tertiary` text) | A contrasting accent for a smaller element that should be noticed but is not urgent (a badge, a highlight, a field to revisit) |
| 4 | `secondary-container` / `on-secondary-container` | Recessive actions, selected items, filters |
| 5 | A `surface-container-*` with `on-surface` / `on-surface-variant` | Grouped neutral content; the tone step itself carries rank |
| 6 | `primary` text on a surface; `outline` stroke | Low-emphasis actions (text or outlined actions) |

**Surface tones as hierarchy.** The most important content group gets the brightest surface in use on that screen,
plus generous space around it. The brightness order differs between themes, so check the order before you pick a
role:

| Theme | Brightest to dimmest (baseline) |
|---|---|
| Light | `surface-container-lowest` N100 > `surface` = `surface-bright` N98 > `-low` N96 > `surface-container` N94 > `-high` N92 > `-highest` N90 > `surface-dim` N87 |
| Dark | `surface-bright` N24 > `-highest` N22 > `-high` N17 > `surface-container` N12 > `-low` N10 > `surface` = `surface-dim` N6 > `-lowest` N4 |

`surface-bright` is the one role that is brighter than `surface-container` in both themes. For "brightest region"
emphasis that holds in light and dark, put the region on `surface-bright` and its surroundings on `surface-container`
or `surface-dim`. On a plain `surface` page, `surface-bright` is invisible in light (same value). For a full-screen
list of groups, follow [A grouped list screen (settings)](#a-grouped-list-screen-settings).

Rules that keep the tactic honest:

- Keep rung-1 elements rare. This skill's heuristic is at most one per region: if everything is primary, nothing is.
- Mix families rather than inventing tints. A tertiary accent next to secondary controls reads as intentional. A
  lighter hex of primary reads as a mistake, and it breaks under contrast levels.
- Overlapping or nested containers must use different surface roles. Tone is the separator, and containers are not
  tied to elevation.
- Keep a region's surface role the same at every breakpoint. On larger windows you may add containers if you apply
  them consistently.

```css
/* Rank regions by surface tone, actions by accent family.
   Markup: <section class="board"> holding <div class="card">s; the key one is class="card card--key". */
.board {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}
.board .card {
  /* darker than the board in both themes (1.22:1 light, 1.14:1 dark); surface-container-low
     would be only 1.04 / 1.05 and the cards would disappear */
  background: var(--md-sys-color-surface-dim);
}
.board .card--key {
  /* brightest region in both themes: N98 over N94 in light, N24 over N12 in dark */
  background: var(--md-sys-color-surface-bright);
}
.board .card .cta {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
/* Same specificity as the rule above, so it must come after it to win on the key card. */
.board .card--key .cta {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.board .card--key .metric {
  color: var(--md-sys-color-primary);
}
.board .badge {
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}
.board .caption {
  color: var(--md-sys-color-on-surface-variant);
}
```

### A grouped list screen (settings)

A settings screen stacks groups of rows under a top app bar, and three rules meet on it: the page is
`surface`, the key group is `surface-bright` over `surface-container`, and the app bar changes tone once
content scrolls beneath it. With the groups placed straight on the page these rules collide, because
`surface-bright` and `surface` are the same value in light theme and the key group would vanish. Give the
groups a content region of their own. Material publishes no role table for this screen. The assignment
below is this skill's, chosen so that every pair of neighbors differs in both themes.

| Layer | Role | Light | Dark | Step to its neighbors (light / dark) |
|---|---|---|---|---|
| Page body | `surface` | `#FEF7FF` | `#141218` | 1.09 / 1.14 to the region |
| App bar at rest | `surface` | `#FEF7FF` | `#141218` | Same as the body; 1.09 / 1.14 to the region below it |
| App bar scrolled | `surface-container-high` | `#ECE6F0` | `#2B2930` | 1.16 / 1.29 to its resting role; 1.07 / 1.13 to the region, 1.14 / 1.29 to the groups, 1.16 / 1.25 to the key group |
| Content region | `surface-container` | `#F3EDF7` | `#211F26` | 1.09 / 1.14 to the body |
| Groups | `surface-dim` | `#DED8E1` | `#141218` | 1.22 / 1.14 to the region |
| Key group | `surface-bright` | `#FEF7FF` | `#3B383E` | 1.09 / 1.41 to the region; 1.33 / 1.61 to the groups |

The steps are WCAG ratios between two fills. They mark structure and never approach text contrast. For
scale, Material's ordinary scrolled app bar (`surface` to `surface-container`) is a 1.09 step in light and
1.14 in dark.

- **Why dim and bright.** Measured against `surface-container`, every other surface is lighter in one theme
  and darker in the other. Only `surface-dim` is darker in both and only `surface-bright` is lighter in both.
  Ordinary groups read as quiet wells and the key group lifts out, and the ranking looks the same in light and
  dark. The tempting
  alternative, ordinary groups on `surface-container-low`, is 1.04:1 from the region in light and 1.05:1 in
  dark, which is too close to see.
- **The app bar.** At rest it takes the body's role and reads as part of the page above the region. Once
  content scrolls under it, the usual scrolled role (`surface-container`) is already the region's, so the bar
  would merge into it. Move it one tier further, to `surface-container-high`. Its thinnest step is against the
  region in light (1.07:1), so its edge shows most clearly where groups pass beneath it. Watch the element that
  scrolls, not `window`: the script below uses a sentinel at the top of the scroller.
- **Nesting levels (PRI-06).** The body is the page, not a container. The region is the first container
  level and the groups are the second, which is the two-level nesting the audit expects. The app bar is not a
  level.
- **Content.** `on-surface` and `on-surface-variant` stay at 6.68:1 or better on every role in the table. The
  tightest pairs are accent text or icons on `surface-dim` in light (`primary` and `secondary` at 4.61:1), so
  use accent roles sparingly there. A selected row uses `secondary-container` / `on-secondary-container`, and
  state layers go over the row's own fill ([interaction-states.md](interaction-states.md#state-layers)).
- **Corners and gaps.** Take the groups' outer corners from the nesting rule and, for rows split into
  segments, the inner corners and gap from the grouped-list default in
  [shape.md](shape.md#inner-corners-asymmetric-shapes). In a segmented group each row carries the group's
  role, and the gaps between rows show the region.
- **Wider windows.** Each pane becomes its own region on the body, and the body's `surface` shows in the
  margins and the pane spacer ([layout.md](layout.md#panes)). The roles stay the same at every width. A bar
  that spans several panes has to know which pane scrolled.
- **Contrast levels and other schemes.** In the token file the surfaces do not change with contrast, so the
  table holds at medium and high. Schemes from MCU's 2021 spec spread the surfaces further apart at medium and
  high. For the baseline seed (tonal spot) and a green seed (vibrant), the thinnest step (scrolled bar against
  the region, light) measured 1.06 at standard, 1.11 at medium and 1.14 at high. Re-measure a hand-built brand
  scheme.

```html
<body>
  <span class="scroll-sentinel"></span>
  <header class="app-bar">...</header>
  <main class="settings">
    <section class="group group--key">...</section>
    <section class="group">...</section>
    <section class="group">...</section>
  </main>
</body>
```

```css
body {
  margin: 0;
  min-block-size: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}
.app-bar {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  transition: background-color var(--m3e-motion-spring-default-effects);
}
.app-bar[data-scrolled] {
  /* one tier past the region's surface-container, so the bar never merges with it */
  background-color: var(--md-sys-color-surface-container-high);
}
.settings {
  flex: 1;
  display: grid;
  align-content: start;
  gap: var(--md-sys-measurement-space300);
  padding: var(--md-sys-measurement-space200);
  border-start-start-radius: var(--md-sys-shape-corner-extra-large);
  border-start-end-radius: var(--md-sys-shape-corner-extra-large);
  background-color: var(--md-sys-color-surface-container);
}
.group {
  padding-block: var(--md-sys-measurement-space100);
  border-radius: var(--md-sys-shape-corner-medium); /* 28px region corner minus 16px padding */
  background-color: var(--md-sys-color-surface-dim);
  color: var(--md-sys-color-on-surface);
}
.group--key {
  padding: var(--md-sys-measurement-space200); /* the key group also gets more room */
  background-color: var(--md-sys-color-surface-bright);
}
```

```js
// The sentinel is the first child of whatever scrolls. root: null watches the document viewport;
// when a pane scrolls instead, put the sentinel first in that pane and pass the pane as root.
const bar = document.querySelector('.app-bar');
const sentinel = document.querySelector('.scroll-sentinel');
new IntersectionObserver(
  ([entry]) => bar.toggleAttribute('data-scrolled', !entry.isIntersecting),
  { root: null },
).observe(sentinel);
```

## Contrast levels

Every scheme exists at three contrast levels, in both themes. The user picks the level. Code that uses correct role
pairs gets all levels for free.

| Level | Purpose | What happens to the roles |
|---|---|---|
| Standard (default) | Visual hierarchy through a mix of strong and soft contrast | Soft tonal containers (tone 90 light / 30 dark) that sit close to the surface tone; `outline-variant` is decorative only |
| Medium | For people who need more contrast but find maximum contrast uncomfortable (halation). Material states a 3:1 minimum. | Accents go one tone step further from the surface. Containers become solid mid-tone fills (tone 40 light / 60 dark) with white or black content. `on-surface` goes to pure black or white. `outline-variant` reaches at least 3.5:1 against the strongest container. |
| High | Maximum legibility. Material targets 7:1. | Another step: accents at tone 20 / 95, containers at tone 30 / 80, `on-surface-variant` at black or white, `outline-variant` at 7.2:1 against the strongest container |

**What changes and what stays.** The token file's contrast blocks restate 35 roles:

- the 17 accent and error roles: `X`, `on-X`, `X-container` and `on-X-container` for primary, secondary, tertiary and
  error, plus `inverse-primary`;
- the 12 fixed-family roles;
- `on-surface`, `on-surface-variant`, `inverse-on-surface` and `on-background`;
- `outline` and `outline-variant`.

In the published tokens, the surfaces never change with contrast: `surface`, `surface-dim`, `surface-bright`, the
five containers, `surface-variant`, `inverse-surface` and `background`. Neither do `scrim` and `shadow`. The content
on a card gets stronger; the card itself does not. Within the 35, `inverse-primary` keeps its value in light, and the
six fixed and fixed-dim fills keep theirs in dark. (Schemes generated with MCU's 2021 spec do move the dim, bright and
container surfaces at medium and high; see [Generating a scheme from a seed](#generating-a-scheme-from-a-seed).)

Design consequence: at medium and high, a container is no longer a soft tint. It becomes a strong fill (tone 40 then
30 in light, tone 60 then 80 in dark) with white or black content. Review every screen at all three levels, not only
standard.

Representative values (the full set is in the token file):

| CSS custom property | Light std | Light medium | Light high | Dark std | Dark medium | Dark high |
|---|---|---|---|---|---|---|
| `--md-sys-color-primary` | `#6750A4` | `#4F378B` | `#381E72` | `#D0BCFF` | `#EADDFF` | `#F6EDFF` |
| `--md-sys-color-on-primary` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#381E72` | `#21005D` | `#000000` |
| `--md-sys-color-primary-container` | `#EADDFF` | `#6750A4` | `#4F378B` | `#4F378B` | `#9A82DB` | `#D0BCFF` |
| `--md-sys-color-on-primary-container` | `#4F378B` | `#FFFFFF` | `#FFFFFF` | `#EADDFF` | `#000000` | `#000000` |
| `--md-sys-color-on-surface` | `#1D1B20` | `#000000` | `#000000` | `#E6E0E9` | `#FFFFFF` | `#FFFFFF` |
| `--md-sys-color-on-surface-variant` | `#49454F` | `#322F37` | `#000000` | `#CAC4D0` | `#E7E0EC` | `#FFFFFF` |
| `--md-sys-color-outline` | `#79747E` | `#49454F` | `#322F37` | `#938F99` | `#AEA9B4` | `#F5EEFA` |
| `--md-sys-color-outline-variant` | `#CAC4D0` | `#79747E` | `#49454F` | `#49454F` | `#938F99` | `#CAC4D0` |
| `--md-sys-color-inverse-primary` | `#D0BCFF` | `#D0BCFF` | `#D0BCFF` | `#6750A4` | `#4F378B` | `#381E72` |
| `--md-sys-color-primary-fixed` | `#EADDFF` | `#6750A4` | `#4F378B` | `#EADDFF` | `#EADDFF` | `#EADDFF` |
| `--md-sys-color-surface` (all surfaces behave alike) | `#FEF7FF` | `#FEF7FF` | `#FEF7FF` | `#141218` | `#141218` | `#141218` |

Measured WCAG ratios of the baseline:

| Pair | Light std | Light med | Light high | Dark std | Dark med | Dark high |
|---|---|---|---|---|---|---|
| on-primary / primary | 6.44 | 9.33 | 13.15 | 7.71 | 13.32 | 18.48 |
| on-primary-container / primary-container | 7.23 | 6.44 | 9.33 | 7.23 | 6.59 | 12.32 |
| on-surface-variant / surface | 8.88 | 12.50 | 19.96 | 10.91 | 14.41 | 18.59 |
| primary / surface | 6.12 | 8.87 | 12.50 | 10.91 | 14.42 | 16.36 |
| outline / surface | 4.33 | 8.88 | 12.50 | 5.87 | 8.09 | 16.37 |
| outline / surface-container-highest | 3.51 | 7.21 | 10.14 | 3.87 | 5.34 | 10.81 |
| outline-variant / surface-container-highest | 1.32 | 3.51 | 7.21 | 1.31 | 3.87 | 7.20 |
| primary-container / surface | 1.23 | 6.12 | 8.87 | 1.99 | 5.83 | 10.91 |
| surface-container-highest / surface | 1.23 | 1.23 | 1.23 | 1.52 | 1.52 | 1.52 |

At standard contrast every `on-X` / `X` pair is at least 6.44:1 and every on-container pair at least 7.17:1. At high
contrast every foreground/accent pair is at least 7.20:1. Measured against `surface`, the other surface roles range
from 1.04 to 1.61:1 at every level (two of them match it exactly), because those steps are about structure, not
legibility.

### WCAG targets you still own

- Body and small text need 4.5:1 against their actual background. Large text (18 pt regular or 14 pt bold and up)
  needs 3:1. Disabled content is exempt.
- Meaningful non-text parts need 3:1 at *standard* contrast. That covers icons, slider and progress tracks,
  selection marks, focus rings and the boundary of a target.
- Adjacent interactive containers (a row of buttons, a segmented group) need 3:1 between each container and the
  background. A standalone prominent element such as a FAB is exempt. Tension: baseline tonal containers are only
  1.21 to 2.04:1 against `surface` at standard contrast, and Material does not reconcile this. This skill's reading:
  for a cluster, either use fills that clear 3:1 (`primary` is 6.12:1) or give each target a boundary of `outline`
  or another role with 3:1.

### Mapping levels to the web

The web has one binary signal, `prefers-contrast: more`. Material does not say which level it should select. The
token file maps it to **high** whenever no `data-contrast` attribute is set. That is this skill's choice: it treats
an OS-wide request for more contrast as a request for the strongest level. **Medium** is reachable only through an
in-app setting (`data-contrast="medium"`). Offer that setting, because medium targets people for whom high contrast
is uncomfortable; [Appearance settings](#appearance-settings) shows the controls. `prefers-contrast: less`
has no Material token set, so stay at standard. Forced-colors modes replace author colors entirely; see
[prefers-color-scheme, prefers-contrast, forced-colors](#prefers-color-scheme-prefers-contrast-forced-colors).

## HCT and tonal palettes

HCT is the color space Material schemes are built in:

- **Hue**, 0 to 360, is circular.
- **Chroma** runs from 0 (grey) up to roughly 120. The reachable maximum depends on hue and tone, so a bright light
  blue cannot be very chromatic.
- **Tone**, 0 (black) to 100 (white), is CIELAB L*. Hue and chroma come from CAM16.

Changing hue or chroma in HCT leaves tone unchanged, and tone alone determines luminance. So contrast can be computed
from tone for any hue. HSL cannot do that: colors with HSL lightness 50 range from about 33 to 96 in perceived
lightness. Never mix HSL, OKLCH or `color-mix()` math with HCT tones, and never assume one of those spaces gives
Material tones or Material contrast.

**Tone gaps guarantee contrast** (minimum WCAG ratio for any pair of tones with this difference):

| Tone difference | Minimum ratio | Enough for |
|---|---|---|
| 40 | 3.17:1 | 3:1 needs: large text, icons, target edges. Material's HCT article uses this gap for elements 40px and larger. |
| 50 | 4.48:1 (about 4.5) | Body text; the HCT article uses this gap for elements under 40px |
| 60 | 6.46:1 | Comfortable body text |
| 70 | 9.15:1 | 7:1 (high-contrast) text |

**Tonal palettes.** Each palette fixes a hue and chroma and varies tone. A scheme has five key palettes (primary,
secondary, tertiary, neutral, neutral-variant) plus error. Baseline palettes carry tones 0, 10 to 100 in steps of 10,
95, 98 and 99. Neutral also has 4, 6, 12, 17, 22, 24, 87, 92, 94 and 96, which exist for the surface roles. Palette
tokens follow the pattern `--md-ref-palette-<palette><tone>`, for example `--md-ref-palette-primary40`.

| Tone | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 98 | 99 | 100 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `--md-ref-palette-primary<tone>` | `#000000` | `#21005D` | `#381E72` | `#4F378B` | `#6750A4` | `#7F67BE` | `#9A82DB` | `#B69DF8` | `#D0BCFF` | `#EADDFF` | `#F6EDFF` | `#FEF7FF` | `#FFFBFE` | `#FFFFFF` |

**Which tones fill which roles.** This is the baseline and MCU 2021 mapping at standard contrast:

| Roles | Light | Dark |
|---|---|---|
| X / on-X / X-container / on-X-container (X = primary, secondary, tertiary, error) | 40 / 100 / 90 / 30 | 80 / 20 / 30 / 90 |
| inverse-primary | P80 | P40 |
| X-fixed / X-fixed-dim / on-X-fixed / on-X-fixed-variant | 90 / 80 / 10 / 30 | same |
| surface, dim, bright | N98, N87, N98 | N6, N6, N24 |
| containers lowest, low, default, high, highest | N100, 96, 94, 92, 90 | N4, 10, 12, 17, 22 |
| on-surface / on-surface-variant | N10 / NV30 | N90 / NV80 |
| inverse-surface / inverse-on-surface | N20 / N95 | N90 / N20 |
| outline / outline-variant | NV50 / NV80 | NV60 / NV30 |
| scrim, shadow | N0 | N0 |

Palette tokens are raw ingredients. They do not flip with theme or contrast, so components must never use them
directly. The **static palette** (`red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `blue-variant`, `purple`, `pink`,
`grey`, `grey-variant`, each at 13 tones without 99, plus `--md-ref-palette-black` / `--md-ref-palette-white`) was
formerly called the extended palette, and dynamic color does not touch it. Use it as source material for a custom
color, not as a component color.

In the token file, the `--md-sys-color-*` values are literal hex values; they do not reference `--md-ref-palette-*`.
Overriding a palette token therefore recolors nothing. To re-theme, override the roles, as shown in
[Generating a scheme from a seed](#generating-a-scheme-from-a-seed).

## Static baseline, brand schemes and custom colors

### Choosing static or dynamic

- **Static** colors are the same for everyone: the baseline, or a scheme your team picks. Choose static when you are
  not ready for dynamic color, when you are migrating from Material 2, for enterprise products, or when parity with an
  iOS build matters. The trade-off: no personalization, and colors do not follow wallpaper or content.
- **Dynamic** colors come from a source color. Choose dynamic when personalization, content-driven color, or
  user-controlled contrast matter, or when you cannot yet tell whether you will need a mix of dynamic and static
  color. The trade-off: colors are
  not identical across devices. Design first against the baseline so role mappings are right, then test many seeds.

On the web, both kinds get contrast levels only if you ship all three levels. The token file does this for the
baseline. A custom static scheme must supply its own medium and high values.

### The baseline

The 3P baseline is the purple scheme in the token file. Its primary40 is `#6750A4`. Its accent and neutral-variant
palettes match MCU's legacy `CorePalette.of(#6750A4)` within one unit per RGB channel. Its neutral palette uses
chroma of about 6 where `CorePalette` uses 4. Its error palette is hand-tuned: error40 is `#B3261E`, where MCU's
default is `#BA1A1A`. Use the file's values as they are. Regenerating the baseline does not
reproduce it: `SchemeTonalSpot` from `#6750A4` yields primary `#65558F`, because tonal spot caps primary chroma at 36.
Google's own 1P theme (blue, primary `#0B57D0`) is not for third-party products and is not in the file.

### A brand scheme

Material Theme Builder takes a brand color as the primary source, plus optional secondary, tertiary, error, neutral
and neutral-variant inputs, and exports code including web CSS. Its "color match" option (color *fidelity*) shifts
tones so the roles look closer to the inputs without breaking contrast. It is on by default for custom baselines and
static colors. If you set up key colors yourself, follow the baseline convention:

- primary and tertiary are the prominent pair, with tertiary at a complementary hue;
- secondary, neutral-variant and neutral share primary's hue at decreasing chroma.

In code, pass your own palettes to `DynamicScheme`; see [A brand scheme in code](#a-brand-scheme-in-code). With your
own primary palette, `primary` is that palette's tone 40 (2021 rules), so the brand color appears exactly only if its
own tone is near 40. `SchemeTonalSpot` also caps chroma, so it never reproduces a saturated brand color. If the exact
brand color must appear, use `SchemeFidelity`, which places the source in `primary-container`.

### Adding custom colors (static colors)

Use a custom color when the product needs a semantic hue the roles do not provide, such as success, warning, or a
data category. Material calls these static colors (formerly "custom colors"). Each one becomes four roles that behave
like an accent family: *color*, *on-color*, *color-container*, *on-color-container*. They must support both themes
and all contrast levels. Rules:

- Do not define your own error red; `error` already exists and must keep its meaning.
- **Harmonize** ordinary semantic colors toward your primary. MCU's `Blend.harmonize(color, primary)` rotates the hue
  toward the primary by half the difference, capped at 15°, and keeps chroma and tone. A red stays red, only warmer or
  cooler. For example, `#4CAF50` harmonized toward `#6750A4` becomes `#00B171`.
- **Do not harmonize** literal colors: brand marks, partner logos, transit lines, real-world signage.
- Name custom roles with a product prefix, never `--md-*` (they are not Material tokens) and never `--m3e-*` (that
  namespace belongs to this skill's helpers). This file uses `--app-color-*`, and so does
  `scripts/generate-scheme.mjs --custom` by default: `--app-color-<name>`, `--app-color-on-<name>`,
  `--app-color-<name>-container` and `--app-color-on-<name>-container`. Pass `--custom-prefix brand` to get
  `--brand-*` instead; the script rejects `--md-` and `--m3e-` prefixes.

**Tone recipe for a custom color group.** Material gives no tone table for static colors at medium and high, so this
recipe is this skill's: it copies the baseline primary family at each level. The smallest gap between a fill and its
on-color is 60 tones, which gives about 6.4:1 or better for any hue. Nine seeds from red to brown, harmonized or not,
all measured 6.43:1 or better.

| Role | Light std | Light med | Light high | Dark std | Dark med | Dark high |
|---|---|---|---|---|---|---|
| color | 40 | 30 | 20 | 80 | 90 | 95 |
| on-color | 100 | 100 | 100 | 20 | 10 | 0 |
| color-container | 90 | 40 | 30 | 30 | 60 | 80 |
| on-color-container | 30 | 100 | 100 | 90 | 0 | 0 |

MCU's `customColor()` helper produces only the standard level and still uses the old tone 10 for the light
on-container. Build the group from a `TonalPalette` instead, with `customColorCss()` from
[Custom color groups in code](#custom-color-groups-in-code) or with the generator's `--custom` option, which applies
the same recipe. The output for a harmonized `#1B873B` success color over the baseline (hex values from MCU 0.4.0;
`generate-scheme.mjs --seed "#6750A4" --custom success=#1B873B` writes the same values in upper case):

```css
:root, [data-contrast="standard"] {
  --app-color-success: light-dark(#006c4a, #71daa9);
  --app-color-on-success: light-dark(#ffffff, #003824);
  --app-color-success-container: light-dark(#8ef7c4, #005236);
  --app-color-on-success-container: light-dark(#005236, #8ef7c4);
}
@media (prefers-contrast: more) {
  :root:not([data-contrast]) {
    --app-color-success: light-dark(#003824, #beffdc);
    --app-color-on-success: light-dark(#ffffff, #000000);
    --app-color-success-container: light-dark(#005236, #71daa9);
    --app-color-on-success-container: light-dark(#ffffff, #000000);
  }
}
[data-contrast="medium"] {
  --app-color-success: light-dark(#005236, #8ef7c4);
  --app-color-on-success: light-dark(#ffffff, #002114);
  --app-color-success-container: light-dark(#006c4a, #35a376);
  --app-color-on-success-container: light-dark(#ffffff, #000000);
}
[data-contrast="high"] {
  --app-color-success: light-dark(#003824, #beffdc);
  --app-color-on-success: light-dark(#ffffff, #000000);
  --app-color-success-container: light-dark(#005236, #71daa9);
  --app-color-on-success-container: light-dark(#ffffff, #000000);
}

.status--ok {
  background: var(--app-color-success-container);
  color: var(--app-color-on-success-container); /* text and icons inside the container */
}
.inline-status-icon {
  color: var(--app-color-success); /* an icon sitting directly on a surface */
}
```

Inside the container, use the `on-...-container` role. Keep `--app-color-success` for text and icons that sit
directly on a surface. These values use `light-dark()`. In a browser without it, every `var()` that reads them
becomes invalid, so the fill turns transparent and the text inherits its color. If those browsers matter, add plain
light and dark values in an `@supports not (color: light-dark(#000, #fff))` block, as the token file does.

**Custom color roles** are new roles on existing palettes, for example a "primary graphic" at primary tone 50 that
must hold 3:1 against `primary-container`. Add one only when no existing role fits. Specify its palette and tone for
each theme and contrast level, name its pairings, and verify the ratios.

### Fixed colors that carry a convention

Some colors mean something because every other product uses them: a red end-call button, a green answer and call
button. People find them by hue, so they shouldn't shift with the theme the way a harmonized custom color does (a
harmonized red drifts toward the brand hue; `error` reads as brick in light mode and pale pink in dark, neither of
them "hang up"). For these, a fixed color is the better choice (our recommendation):

- **One hue, the same in light and dark**, with white content, as product tokens:
  `--app-color-end-call: #db372d; --app-color-on-end-call: #fff; --app-color-start-call: #1e8e3e;`
  `--app-color-on-start-call: #fff;` (the values one product shipped).
- **Check both pairs.** The icon or label on the fill is non-text contrast at minimum (3:1) and text contrast if it's a
  label (4.5:1): white measures 4.57:1 on `#db372d` and 4.21:1 on `#1e8e3e`, so a green with a text label needs a
  darker shade. The fill against the surface around it needs 3:1 as well (those two reach 4.0 to 4.4:1 against the
  baseline light and dark surfaces).
- **Apply them through the component's own tokens** (container, label, state layer and ripple colors), so hover,
  focus and press layers stay correct.
- **Use them only for the convention**: the call and end-call actions, wherever they appear (call screen, incoming
  call, pop-out, dialer). Everything else stays on roles.

## Dynamic color

### The pipeline

1. **Source color.** It comes from the wallpaper (user-generated), from in-app content such as album art
   (content-based), or from a hand-picked seed (brand or baseline). For images, MCU quantizes the pixels to at most
   128 colors, scores them for colorfulness and coverage, and takes the top-ranked color.
2. **Key colors and palettes.** A scheme variant derives the hue and chroma of primary, secondary, tertiary, neutral
   and neutral-variant, and each becomes a tonal palette.
3. **Roles.** Tones from those palettes fill every role, for light and dark and for each contrast level.

In the 2021 spec, error is not derived from the source. It stays red, and theme and contrast still adjust it. Other
fixed-meaning colors (your custom semantic colors) can also stay out of the dynamic set.

### Choosing a source

| Source | Choose it when | On the web |
|---|---|---|
| User-generated (wallpaper) | Users benefit from a well-tested personal look, or you want the newest Material features | Browsers do not expose the Android wallpaper palette, so let the user pick a seed (a theme picker) and persist it |
| Content-based | Content is the hero (media players, articles by publication), the team can handle some advanced customization, and the color helps people use the screen | `sourceColorFromImage(img)` from MCU; scope the result to the region next to the image |
| Both | Both reasons apply and you accept more customization work | A user or brand scheme for the app, and a content scheme for one contained area |

Rules for content-based color:

- Apply it to a contained region adjacent to its source image, and keep the image visible on that screen. Material's
  source page allows the image to be absent at times; the apply-colors page is stricter. Follow the stricter rule
  unless you have a reason not to.
- Use at most two schemes from different source types on one screen.
- Never let content color replace error or other semantic colors.
- A full-screen moment in content color (for example an expanded player) is fine. Tie it back to the source.

### Scheme variants (MCU)

m3.material.io names only three algorithms: user-generated, content-based, and custom colors. MCU implements them as
variants. The mapping from algorithm to variant below is this skill's inference from MCU's documentation and
behavior. Samples use seed `#6750A4`, light theme, standard contrast, MCU 0.4.0.

| Class | Character | Choose for | Sample primary / primary-container | 2025 spec |
|---|---|---|---|---|
| `SchemeTonalSpot` | Low to medium colorfulness; primary chroma 36; tertiary 60° from the seed. The Android 12/13 default. | User-picked seeds and personalization: the safe default | `#65558F` / `#E9DDFF` | Yes |
| `SchemeContent` | Places the seed (tone-adjusted) in `primary-container`; secondary at reduced chroma; tertiary analogous | Content-based color from images | `#4F378A` / `#6750A4` | No (falls back to 2021) |
| `SchemeFidelity` | Like content, but tertiary is the seed's complement | A brand or input color that must appear recognizably | `#4F378A` / `#6750A4` | No |
| `SchemeNeutral` | Near grey (primary chroma 12) | Calm, content-heavy, enterprise | `#615C6B` / `#E7DFF2` | Yes |
| `SchemeVibrant` | Maximum chroma across the primary palette | Bold, playful, media | `#6F19FF` / `#E9DDFF` | Yes |
| `SchemeExpressive` | Hue deliberately moved away from the seed (primary hue +240° in 2021; the 2025 spec keeps the seed hue for primary and rotates the others) | Playful themes where the seed hue need not show. Not required by M3 Expressive. | `#006B5A` / `#95F4DC` | Yes |
| `SchemeRainbow` | Seed-hued accents over pure grey neutrals | Colorful accents on colorless surfaces | `#6750A4` / `#E9DDFF` | No |
| `SchemeFruitSalad` | Primary rotated 50° from the seed; the seed hue moves to tertiary | Playful | `#00639C` / `#CEE5FF` | No |
| `SchemeMonochrome` | Chroma 0 everywhere, error excepted | Colorless or focus modes | `#000000` / `#3B3B3B` | No |

MCU's doc comment for Rainbow and Fruit Salad says the seed hue does not appear. In 0.4.0, Rainbow's primary keeps
the seed hue, and Fruit Salad shows the seed hue in tertiary. Trust the measured output, not the comment.

## MCU color spec 2021 vs 2025

MCU 0.4.0 accepts a `specVersion` of `'2021'` (the default) or `'2025'`. Newer MCU sources also list `'2026'`,
which reuses the 2025 rules for these variants. The 2025 spec changes the tonal spot, neutral, vibrant and expressive
variants. All other variants silently fall back to 2021, even if you ask for 2025. No m3.material.io page or
published token documents the 2025 output. Only third-party libraries describe it as "Material 3 Expressive". It
plausibly matches newer Android system dynamic color, but Material has not confirmed that.

| Aspect | 2021 (documented tokens, token file) | 2025 |
|---|---|---|
| Accent tones | Fixed: 40/80, containers 90/30 | The tone of maximum chroma within per-variant bounds (e.g. tonal-spot light primary-container at most 90; vibrant 66 to 93) |
| On-color targets | Tone recipes plus contrast curves | On-accent 6:1 (on-error-container 4.5:1); on-surface 9:1 light / 11:1 dark; outline 3:1; outline-variant 1.5:1 |
| Surfaces | Dark surface N6, containers 4/10/12/17/22, bright 24; surfaces move with contrast level in MCU | Dark surface T4, containers 0/6/9/12/15, bright 18; more tinted (chroma multipliers); constant across contrast |
| Low contrast (level -1) | Supported | Removed (behaves like standard) |
| Neutral-variant roles | `on-surface-variant`, `outline`, `outline-variant` from neutral-variant | From neutral, with chroma multipliers |
| Aliases | `surface-variant` NV90/NV30; `surface-tint` fixed at P40/P80 | `surface-variant` = `surface-container-highest`; `background` = `surface`; `surface-tint` = `primary` |
| Fixed roles | P90 / P80 | Fixed = the light container tone; fixed-dim = 5 tones darker |
| Error | Hue 25, chroma 84 regardless of seed (MCU default; the baseline's error palette is hand-tuned) | Hue 12, 22 or 32 chosen by seed hue; chroma 50 to 80 by variant |
| Extra roles | none | `primary-dim`, `secondary-dim`, `tertiary-dim`, `error-dim` (mainly for watches; no token in the file) |
| `platform` argument | n/a | `'phone'` (default) or `'watch'` |

Applied to the baseline palettes, the 2025 spec changes 230 of 294 role-and-context values. For example, light
`primary-container` goes from tone 90 to tone 72, light `on-surface` from tone 10 to tone 21, and light `on-primary`
from pure white to `#FDF7FF`.

**Recommendation:** use `'2021'`, the default. It reproduces the documented tokens and the shipped CSS, and every
variant supports it. Try `'2025'` only if you deliberately want the newer, more chromatic look, and accept that
nothing in Material documents its values. If you do, stay with the four variants that implement it.

## Applying it on the web

### How the shipped token file is organized

- `:root` holds all palette tokens, `--md-sys-color-shadow` and `--md-sys-color-scrim`, and sets
  `color-scheme: light dark`, so the page follows the OS theme.
- `@supports (color: light-dark(#000, #fff))` holds every other role as `light-dark(<light>, <dark>)`. A role that
  is identical in both themes, such as the fixed family at standard contrast, is written as a plain hex value. Then
  come the contrast blocks: `@media (prefers-contrast: more) { :root:not([data-contrast]) }` (high), and
  `[data-contrast="standard" | "medium" | "high"]`. Each contrast block restates only the 35 roles that change.
- `@supports not (...)` is a fallback for browsers without `light-dark()` (before Chrome/Edge 123, Firefox 120,
  Safari 17.5). It has plain light and dark values at standard contrast only, and `data-contrast` does nothing there.
- Color helpers: `--m3e-scrim` (scrim at 32%), `--m3e-scrim-opacity` (0.32), `--m3e-focus-indicator-color`
  (aliases `secondary`), the `box-shadow` helpers `--m3e-elevation-shadow-level0` to `level5` and their `filter:`
  twins `--m3e-elevation-drop-shadow-level0` to `level5` (for clipped shapes; both are built on `shadow`), and
  `--m3e-state-disabled-container-opacity` (0.1), the opacity of `on-surface` for a disabled container. These are
  web helpers, not Material tokens.

| Switch (on `<html>` or any element) | Values | Effect |
|---|---|---|
| `data-theme` | `light`, `dark`; absent = follow the OS | Sets `color-scheme`, which decides which side of every `light-dark()` is used |
| `data-contrast` | `standard`, `medium`, `high`; absent = standard, or high when the OS reports `prefers-contrast: more` | Swaps the 35 contrast-dependent roles |

Both switches work on a subtree. `data-theme="dark"` on a section makes a dark island. `data-contrast` on an element
re-declares the roles there.

**Cascade caveats.**

- A custom property that uses `var()` is resolved on the element that declares it. `--md-sys-color-surface-tint`
  and `--m3e-focus-indicator-color` are declared on `:root` and in the `data-contrast` blocks. `--m3e-scrim` and the
  shadow helpers (`box-shadow` and drop-shadow) are declared on `:root` only. If you override roles on a subtree,
  re-declare the helpers that should follow the new roles in the same scope.
- The role properties themselves need no re-declaring for a theme island: `light-dark()` is resolved on the element
  that finally uses the value.
- Inherited `color` is the exception. It is computed on the parent, so text in a `data-theme="dark"` section keeps
  the light page's dark text. Every element that switches theme or contrast, or carries a scoped scheme, must set its
  own `background` and `color` from roles:

```css
/* :where() keeps specificity at zero, so a component's own background and color still win. */
:where([data-theme], [data-contrast], .player) {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}
```

### Using roles in component CSS

```css
body {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}
.app-nav {
  background: var(--md-sys-color-surface-container);
}
.supporting-text {
  color: var(--md-sys-color-on-surface-variant);
}
.action-primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.action-tonal {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.field {
  border: 1px solid var(--md-sys-color-outline);
}
.field:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
.field[aria-invalid="true"] {
  border-color: var(--md-sys-color-error);
}
.divider {
  border: 0;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}
.toast {
  background: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
}
.toast a {
  color: var(--md-sys-color-inverse-primary);
}
.modal-backdrop {
  background: var(--m3e-scrim);
}
.dialog {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}
```

### Theme and contrast switching

Put this inline in `<head>` so the attributes are set before first paint and the page does not flash the wrong
theme. `"system"` removes the attribute and hands control back to the OS media queries.

```html
<meta name="color-scheme" content="light dark">
<script>
  function setColorPrefs(prefs) {
    const root = document.documentElement;
    const { theme = 'system', contrast = 'system' } = prefs || {};
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);          // 'light' | 'dark'
    if (contrast === 'system') root.removeAttribute('data-contrast');
    else root.setAttribute('data-contrast', contrast);    // 'standard' | 'medium' | 'high'
    try { localStorage.setItem('color-prefs', JSON.stringify({ theme, contrast })); } catch {}
  }
  try { setColorPrefs(JSON.parse(localStorage.getItem('color-prefs'))); } catch {}
</script>

<!-- A dark island inside a light page; contrast still follows the page. It needs its own
     background and color (see the cascade caveats above). -->
<section data-theme="dark" class="promo">...</section>
```

From JavaScript, reading a role with `getPropertyValue('--md-sys-color-primary')` returns the unresolved
`light-dark(...)` text. For canvas or charts, read a resolved property instead. Put the probe inside the element
whose theme and contrast you need, and read again when either changes:

```js
function resolveRole(role, context = document.body) {
  const probe = document.createElement('span');
  probe.style.color = `var(--md-sys-color-${role})`;
  context.append(probe);
  const value = getComputedStyle(probe).color; // e.g. "rgb(103, 80, 164)"
  probe.remove();
  return value;
}
const primary = resolveRole('primary', document.querySelector('.dashboard')); // the chart's container
```

### Appearance settings

Offer theme and contrast as two single-select settings. Material has no settings pattern for this; the
controls below are this skill's recommendation, built on the token file's switches.

| Setting | Options, in this order | What the option does on `<html>` |
|---|---|---|
| Theme | System, Light, Dark | System removes `data-theme`, so the page follows `prefers-color-scheme`. Light and Dark set `data-theme="light"` or `"dark"`. |
| Contrast | System, Standard, Medium, High | System removes `data-contrast`: standard, or high when the OS reports `prefers-contrast: more`. The other three set `data-contrast` to `standard`, `medium` or `high` and override the OS. |

- **Choices, not switches.** A "High contrast" switch cannot reach medium, the level meant for people who find
  high uncomfortable, and nobody can tell what its off position means: standard, or whatever the device asks
  for? A "Dark theme" switch loses System in the same way. Use a segmented button group or a list of radio rows.
- **System first, and the default.** New users then get their device settings until they choose otherwise.
- **Show what System means right now,** for example "System (Dark)" and "System (High)", read from
  `matchMedia` and updated when the device setting changes. Without it, a user whose OS asks for more contrast
  sees high-contrast colors while the control says System, with no hint why.
- **Apply at once, on `<html>`, and remember it.** `setColorPrefs()` above does both, and its inline copy in
  `<head>` restores the choice before first paint. Schemes scoped with `--selector` and custom-color groups
  follow the attributes on `<html>`, so they switch too.
- **Colors of the control.** The selected option takes `secondary-container` with `on-secondary-container`;
  unselected options stay on the surface with `on-surface`. Give each segment an `outline` border, because tonal
  fills side by side fall below 3:1 against the surface ([WCAG targets you still own](#wcag-targets-you-still-own)).
  Hidden radios inside segments need the replacement focus ring and target sizes in
  [interaction-states.md](interaction-states.md#touch-targets).
- **Browsers without `light-dark()`** fall back to standard contrast, where `data-contrast` has no effect, so
  hide the contrast setting there. The script below does.
- A motion choice (`data-motion-scheme="standard"` for calmer springs) fits on the same screen; see
  [motion.md](motion.md#motion-schemes-expressive-and-standard).

```html
<fieldset>
  <legend>Theme</legend>
  <label><input type="radio" name="theme" value="system"> System (<span data-system-now="theme"></span>)</label>
  <label><input type="radio" name="theme" value="light"> Light</label>
  <label><input type="radio" name="theme" value="dark"> Dark</label>
</fieldset>
<fieldset id="contrast-setting">
  <legend>Contrast</legend>
  <label><input type="radio" name="contrast" value="system"> System (<span data-system-now="contrast"></span>)</label>
  <label><input type="radio" name="contrast" value="standard"> Standard</label>
  <label><input type="radio" name="contrast" value="medium"> Medium</label>
  <label><input type="radio" name="contrast" value="high"> High</label>
</fieldset>
```

```js
// Runs after the <head> script, which defines setColorPrefs().
const root = document.documentElement;
const osDark = matchMedia('(prefers-color-scheme: dark)');
const osMore = matchMedia('(prefers-contrast: more)');
const current = () => ({
  theme: root.getAttribute('data-theme') ?? 'system',
  contrast: root.getAttribute('data-contrast') ?? 'system',
});

// What "System" resolves to now, using the token file's mapping (more contrast -> high).
function showSystemValues() {
  document.querySelector('[data-system-now="theme"]').textContent = osDark.matches ? 'Dark' : 'Light';
  document.querySelector('[data-system-now="contrast"]').textContent = osMore.matches ? 'High' : 'Standard';
}

for (const input of document.querySelectorAll('input[name="theme"], input[name="contrast"]')) {
  input.checked = input.value === current()[input.name];
  input.addEventListener('change', () => setColorPrefs({ ...current(), [input.name]: input.value }));
}
osDark.addEventListener('change', showSystemValues);
osMore.addEventListener('change', showSystemValues);
showSystemValues();

// Without light-dark() the token file has standard contrast only, so the setting would do nothing.
if (!CSS.supports('color', 'light-dark(#000, #fff)')) {
  document.getElementById('contrast-setting').hidden = true;
}
```

### prefers-color-scheme, prefers-contrast, forced-colors

- **`prefers-color-scheme`** needs no code: `color-scheme: light dark` on `:root` makes `light-dark()` follow the OS
  until you set `data-theme`.
- **`prefers-contrast: more`** selects the high set automatically when no `data-contrast` is set. Offer an explicit
  setting as well ([Appearance settings](#appearance-settings)), so medium is reachable and users can override the OS.
- **`forced-colors: active`** (e.g. Windows contrast themes) replaces your colors with a small set of system colors.
  Material roles no longer apply, so make sure the structure survives: give containers and controls a transparent
  border (it turns visible in forced colors), never show state by fill alone, and paint custom indicators with system
  colors. This is general web practice; Material does not cover it.

```css
.card,
.chip,
.action-tonal {
  border: 1px solid transparent; /* invisible normally, drawn in forced-colors mode */
}
.chip[aria-pressed="true"] {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
@media (forced-colors: active) {
  .chip[aria-pressed="true"] {
    border-color: Highlight;
    outline: 2px solid Highlight;
  }
  .progress-indicator {
    background: CanvasText;
  }
  .color-swatch {
    forced-color-adjust: none; /* the color is the content here */
  }
}
```

### Derived colors with color-mix()

`color-mix()` works directly on the hex and `light-dark()` values of the role properties, so you need no RGB-channel
variables. It is supported in every current engine since 2023. Use it for opacity-based layers, never to invent new
tones: an 80% primary is not a Material tone and has no contrast guarantee.

```css
/* State layer: the content color over the container at the state opacity. Hover only where a
   pointer can hover, and :not(:disabled) because a disabled button still matches :hover. */
@media (hover: hover) {
  .action-primary:hover:not(:disabled) {
    background: color-mix(in srgb, var(--md-sys-color-on-primary) calc(var(--md-sys-state-hover-state-layer-opacity) * 100%), var(--md-sys-color-primary));
  }
}
.action-primary:active:not(:disabled) {
  background: color-mix(in srgb, var(--md-sys-color-on-primary) calc(var(--md-sys-state-pressed-state-layer-opacity) * 100%), var(--md-sys-color-primary));
}
/* Disabled: content is on-surface at the 0.38 token, and the container is on-surface at the
   --m3e-state-disabled-container-opacity helper (0.1; Material sets it per component, not as a sys token). */
.action-primary:disabled {
  background: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--m3e-state-disabled-container-opacity) * 100%), transparent);
  color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--md-sys-state-disabled-state-layer-opacity) * 100%), transparent);
}
/* Scrim: the helper is exactly this. */
.sheet-backdrop {
  background: color-mix(in srgb, var(--md-sys-color-scrim) calc(var(--m3e-scrim-opacity) * 100%), transparent);
}
/* Button color and state-layer changes run on the fast effects spring (no overshoot). */
.action-primary,
.action-tonal {
  transition:
    background-color var(--m3e-motion-spring-fast-effects),
    color var(--m3e-motion-spring-fast-effects);
}
```

State-layer opacities, disabled containers and focus rings are covered in
[interaction-states.md](interaction-states.md#state-layers), and spring choice in
[motion.md](motion.md#spatial-and-effects-springs). Larger surfaces that change color, such as the scrolled app bar
in [the grouped list recipe](#a-grouped-list-screen-settings), use the default effects spring.

### Generating a scheme from a seed

Both routes below use `@material/material-color-utilities` (ESM; run against version 0.4.0) and emit the same
`--md-sys-color-*` properties and selectors as the token file. Load the output **after** the token file. The
generated scheme then wins at every theme and contrast level, including the `prefers-contrast` mapping.

**Build time: the skill's script.** Install the library in the project (`npm i -D @material/material-color-utilities`),
then run the script from the project root so it finds the library. `scripts/` is inside this skill's folder; adjust
the path.

```sh
node scripts/generate-scheme.mjs --seed "#8C4F2B" --out theme.css
node scripts/generate-scheme.mjs --seed "#8C4F2B" --variant fidelity --selector .brand --out brand.css
```

Options: `--variant` (`tonal-spot` by default, or `neutral`, `vibrant`, `expressive`, `fidelity`, `content`,
`monochrome`, `rainbow`, `fruit-salad`), `--spec 2021|2025` (default `2021`), `--selector` to scope the scheme to a
subtree, `--custom success=#1B873B,warning=#B26A00!` for custom colors (harmonized toward the seed; a trailing `!`
skips harmonization), `--custom-prefix` to rename them (default `app-color`), `--palettes` to add
`--md-ref-palette-*` values (reference only: the roles do not read them), and `--out`. The output holds all 48 roles
plus the `surface-tint` and focus-indicator aliases at three contrast levels, and a plain light/dark fallback for
browsers without `light-dark()`. Two behaviors to know:

- `--custom` colors come out as product tokens, `--app-color-<name>`, `--app-color-on-<name>`,
  `--app-color-<name>-container` and `--app-color-on-<name>-container` (`--custom-prefix brand` gives `--brand-*`;
  `--md-` and `--m3e-` prefixes are refused). Each group has standard, medium and high tones, from the same recipe as
  `customColorCss()` in [Custom color groups in code](#custom-color-groups-in-code). As with the roles, the fallback
  block for browsers without `light-dark()` holds the standard tones only.
- With `--selector`, the scheme follows `data-theme` / `data-contrast` set on an ancestor such as `<html>`, on the
  scoped element, or inside it, and an explicit attribute always beats the OS preference. If two ancestors at
  different levels set different contrast values, the later level in the file wins rather than the nearer one, so
  set it either on `<html>` or on the scoped element.

**Runtime, or your own build step: `schemeCss()`.**

```js
// scheme-css.js
import {
  argbFromHex, hexFromArgb, Hct, MaterialDynamicColors, SchemeTonalSpot,
} from '@material/material-color-utilities';

// Every role the token file sets per theme and contrast level.
export const ROLES = [
  'primary', 'on-primary', 'primary-container', 'on-primary-container', 'inverse-primary',
  'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
  'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
  'error', 'on-error', 'error-container', 'on-error-container',
  'primary-fixed', 'primary-fixed-dim', 'on-primary-fixed', 'on-primary-fixed-variant',
  'secondary-fixed', 'secondary-fixed-dim', 'on-secondary-fixed', 'on-secondary-fixed-variant',
  'tertiary-fixed', 'tertiary-fixed-dim', 'on-tertiary-fixed', 'on-tertiary-fixed-variant',
  'surface', 'surface-dim', 'surface-bright', 'surface-container-lowest', 'surface-container-low',
  'surface-container', 'surface-container-high', 'surface-container-highest',
  'on-surface', 'surface-variant', 'on-surface-variant', 'inverse-surface', 'inverse-on-surface',
  'background', 'on-background', 'outline', 'outline-variant', 'shadow', 'scrim',
];
const camel = (role) => role.replace(/-(\w)/g, (_, c) => c.toUpperCase());

function declarations(source, Scheme, contrastLevel) {
  const light = new Scheme(source, false, contrastLevel);
  const dark = new Scheme(source, true, contrastLevel);
  return [
    ...ROLES.map((role) => {
      const color = MaterialDynamicColors[camel(role)];
      const l = hexFromArgb(color.getArgb(light));
      const d = hexFromArgb(color.getArgb(dark));
      return `  --md-sys-color-${role}: ${l === d ? l : `light-dark(${l}, ${d})`};`;
    }),
    // Aliases resolve where they are declared, so restate them next to the new roles.
    '  --md-sys-color-surface-tint: var(--md-sys-color-primary);',
    '  --m3e-focus-indicator-color: var(--md-sys-color-secondary);',
  ].join('\n');
}

// scope: omit to theme the whole document, or pass one selector such as '.player'.
export function schemeCss(seedHex, { Scheme = SchemeTonalSpot, scope } = {}) {
  const source = Hct.fromInt(argbFromHex(seedHex));
  const rule = (selector, level) => `${selector} {\n${declarations(source, Scheme, level)}\n}`;
  // A data-contrast attribute on an ancestor (such as <html>), on the scope itself, or inside it.
  const at = (level) => scope
    ? `[data-contrast="${level}"] ${scope}, ${scope}[data-contrast="${level}"], ${scope} [data-contrast="${level}"]`
    : `[data-contrast="${level}"]`;
  // :where() keeps the OS-preference rule weaker than any explicit data-contrast selector.
  const osMore = scope ? `:where(:root:not([data-contrast])) ${scope}` : ':root:not([data-contrast])';
  return [
    '@supports (color: light-dark(#000, #fff)) {',
    rule(`${scope ?? ':root'}, ${at('standard')}`, 0),
    `@media (prefers-contrast: more) {\n${rule(osMore, 1)}\n}`,
    rule(at('medium'), 0.5),
    rule(at('high'), 1),
    '}',
  ].join('\n');
}
```

```js
// Your own build step (Node 18+ resolves the package directly).
import { writeFileSync } from 'node:fs';
import { schemeCss } from './scheme-css.js';
writeFileSync('theme.css', schemeCss('#8C4F2B')); // light primary #8c4e29, dark #ffb68f
```

A user-picked seed (the web stand-in for wallpaper color) needs two parts. An inline script in `<head>`, placed after
the token file's `<link>`, restores the last scheme before first paint:

```html
<script>
  try {
    const css = localStorage.getItem('scheme-css');
    if (css) {
      const s = document.createElement('style');
      s.id = 'scheme';
      s.textContent = css;
      document.head.append(s);
    }
  } catch {}
</script>
```

The bundled app code then regenerates the scheme when the user picks a seed:

```js
import { schemeCss } from './scheme-css.js';

let style = document.getElementById('scheme');
if (!style) {
  style = document.createElement('style');
  style.id = 'scheme';
  document.head.append(style); // after the token file
}
function applySeed(hex) {
  const css = schemeCss(hex);
  style.textContent = css; // replace the previous scheme; never stack <style> elements
  try { localStorage.setItem('scheme-css', css); } catch {}
}
// <input type="color" id="seed-picker"> returns "#rrggbb"
document.getElementById('seed-picker').addEventListener('change', (e) => applySeed(e.target.value));
```

API notes for 0.4.0:

- Scheme constructors take `(sourceColorHct, isDark, contrastLevel, specVersion?, platform?)`. `contrastLevel` is
  0 for standard, 0.5 for medium and 1 for high. `specVersion` is `'2021'` (default) or `'2025'`.
- `MaterialDynamicColors.<camelCaseRole>.getArgb(scheme)` and the getter `scheme.<camelCaseRole>` both return ARGB
  integers. `hexFromArgb` returns lowercase `#rrggbb`. Newer MCU sources expose `scheme.colors.<role>()` instead, so
  check the version you install.
- Generated medium and high values also move several surface roles (dim, bright, the containers), so they will not
  match the token file's baseline values. That is expected: always emit all three levels for any non-baseline scheme.
- Browsers without `light-dark()` skip the `schemeCss()` block (it sits inside `@supports`) and keep the baseline
  fallback. The script also writes plain light and dark blocks. Use its output, or emit them yourself, if those
  browsers matter.
- The bare import `'@material/material-color-utilities'` works in bundlers (Vite, esbuild, webpack). In plain Node,
  version 0.4.0 fails with `ERR_MODULE_NOT_FOUND` because a few of its internal imports omit the `.js` extension
  (for example `./dynamic_color` in `color_spec_2025.js`). Run Node scripts through a bundler or `tsx`, or register a
  resolve hook that retries with `.js`, as `scripts/generate-scheme.mjs` does. A browser without a bundler needs an
  import map, and hits the same missing-extension problem.
- Avoid `themeFromSourceColor()` and `applyTheme()`. They use the deprecated `Scheme` class, output only 29 roles
  (no surface containers, dim/bright or fixed roles), use tone 10 on-containers, write inline styles, and name palette
  properties `--md-ref-palette-primary-primary40`.

### Content-based color from an image

```js
import { sourceColorFromImage, hexFromArgb, SchemeContent } from '@material/material-color-utilities';
import { schemeCss } from './scheme-css.js';

// <img crossorigin="anonymous"> for images from another origin (the server must send CORS headers)
const art = document.querySelector('.player img');
await art.decode(); // fully loaded first; see the note below
const seed = hexFromArgb(await sourceColorFromImage(art));
const style = document.createElement('style');
style.textContent = schemeCss(seed, { Scheme: SchemeContent, scope: '.player' });
document.head.append(style);
// .player also needs its own background and color (see the cascade caveats).
```

`sourceColorFromImage` draws the image to a canvas at its displayed size and reads the pixels. A cross-origin image
without CORS taints the canvas and the read fails. After `decode()` the promise rejects. Without it, the read may
run in the image's load handler, where the error is lost and the promise never settles. Pixels that are not fully
opaque are ignored. To sample only part of the image, add `data-area="x,y,width,height"` to the `<img>`, in displayed
pixels. `sourceColorFromImageBytes(rgba)` accepts raw RGBA bytes, for workers or Node.

### A brand scheme in code

Pass your own key palettes to `DynamicScheme`. Palettes you leave out come from the variant's rules; the error
palette falls back to MCU's default (`#BA1A1A` at tone 40). The class plugs into `schemeCss()` above.

```js
import { argbFromHex, DynamicScheme, TonalPalette, Variant } from '@material/material-color-utilities';
import { schemeCss } from './scheme-css.js';

const palette = (hex) => TonalPalette.fromInt(argbFromHex(hex));
class BrandScheme extends DynamicScheme {
  constructor(sourceColorHct, isDark, contrastLevel) {
    super({
      sourceColorHct, isDark, contrastLevel, variant: Variant.TONAL_SPOT,
      primaryPalette: palette('#8C4F2B'),
      tertiaryPalette: palette('#2E6F9E'),
      neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 6),
    });
  }
}
const css = schemeCss('#8C4F2B', { Scheme: BrandScheme }); // light primary #8c4f2b
```

### Custom color groups in code

```js
import { argbFromHex, hexFromArgb, Blend, TonalPalette } from '@material/material-color-utilities';

// Tone recipe copied from the baseline primary family: [color, on-color, container, on-container].
const RECIPE = {
  standard: { light: [40, 100, 90, 30], dark: [80, 20, 30, 90] },
  medium: { light: [30, 100, 40, 100], dark: [90, 10, 60, 0] },
  high: { light: [20, 100, 30, 100], dark: [95, 0, 80, 0] },
};
const SLOTS = (n) => [n, `on-${n}`, `${n}-container`, `on-${n}-container`];

export function customColorCss(name, colorHex, { harmonizeWith, prefix = '--app-color' } = {}) {
  let argb = argbFromHex(colorHex);
  if (harmonizeWith) argb = Blend.harmonize(argb, argbFromHex(harmonizeWith)); // skip for brand/literal colors
  const palette = TonalPalette.fromInt(argb);
  const block = ({ light, dark }) => SLOTS(name).map((slot, i) =>
    `  ${prefix}-${slot}: light-dark(${hexFromArgb(palette.tone(light[i]))}, ${hexFromArgb(palette.tone(dark[i]))});`,
  ).join('\n');
  return [
    `:root, [data-contrast="standard"] {\n${block(RECIPE.standard)}\n}`,
    `@media (prefers-contrast: more) {\n:root:not([data-contrast]) {\n${block(RECIPE.high)}\n}\n}`,
    `[data-contrast="medium"] {\n${block(RECIPE.medium)}\n}`,
    `[data-contrast="high"] {\n${block(RECIPE.high)}\n}`,
  ].join('\n');
}
// customColorCss('success', '#1B873B', { harmonizeWith: '#6750A4' }) produced the success CSS above.
```

## Do and don't

| Do | Don't | Why |
|---|---|---|
| Color every element with a `--md-sys-color-*` role (or your own `--app-color-*` group) | Write hex, `rgb()`, or `--md-ref-palette-*` values in component CSS | Only roles change with theme, contrast and scheme |
| Put `on-X` content on `X` | Put `primary` text on `primary-container`, or `on-surface` on `secondary-container` | Other pairs fail at medium or high contrast (1.45:1 and 2.26:1 in the baseline) |
| Use containers as fills only | Use a `*-container` role for text or icons | Containers are pale at standard contrast and carry no contrast guarantee as foregrounds |
| Reserve `primary` fills for the key action of a region, and step others down the ladder | Make every button and chip primary | Emphasis only exists relative to something quieter |
| Separate regions with different surface-container tones | Tint surfaces with `surface-tint` overlays or opacity hacks | Tone-based containers replaced tint overlays in 2023 |
| Put the key region on `surface-bright` over `surface-container` or `surface-dim` | Use `surface-bright` on a plain `surface` page for emphasis | They are the same value in the light theme |
| On a grouped list, set `surface-dim` groups and a `surface-bright` key group on a `surface-container` region | Put ordinary groups on `surface-container-low` over that region | 1.04:1 in light and 1.05:1 in dark: the groups disappear |
| Offer contrast as System, Standard, Medium and High | Offer a single high-contrast switch | A switch cannot reach medium, and its off position is ambiguous |
| Draw target boundaries with `outline` (or any role with 3:1) | Let `outline-variant` alone mark where a control is | It is decorative: 1.62:1 on `surface` in light |
| Test every screen at standard, medium and high in both themes | Sign off on standard light only | Containers change character at medium and high |
| Set `background` and `color` on every `data-theme` island or scoped scheme | Let text inside the island inherit its color | Inherited `color` was resolved in the parent's theme |
| Harmonize semantic custom colors toward primary | Harmonize logos, brand marks or signage colors | Literal colors must stay exact |
| Keep `error` for errors | Define your own red, or let content color replace error | Error must keep one unambiguous meaning |
| Generate tones in HCT with MCU | Build tonal steps with `color-mix()`, HSL or OKLCH lightness | Only HCT tone gaps guarantee contrast |
| Use `SchemeTonalSpot` (2021 spec) for user seeds and `SchemeContent` for images | Assume `SchemeExpressive` is what M3 Expressive needs | That variant predates M3 Expressive and pulls color away from the seed |
| Animate color changes on an effects spring: `--m3e-motion-spring-fast-effects` for buttons and state layers | Animate color with spatial (bouncy) springs | Overshoot on color reads as flicker |

## Auditing

The consolidated checklist lives in [`references/audit-checklist.md`](audit-checklist.md). For a full review,
start from its Quick audit, then run its [Color (COL)](audit-checklist.md#color-col) checks, which carry IDs,
severities, verification steps and the findings report template. The list below is the short version for this
topic.

1. **Roles only.** Pass if every color in component styles resolves to a `--md-sys-color-*` role, a color helper
   built on roles (`--m3e-scrim`, `--m3e-focus-indicator-color`) or a documented custom group. Fail on literal colors
   or `--md-ref-palette-*` in component CSS. Grep:
   `#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(|--md-ref-palette-`.
2. **Pairs.** Pass if every text and icon color is the `on-` partner of its fill, following the pairing matrix. Fail
   on `primary` text inside `primary-container`, or on any `*-container` used as `color`.
3. **All six contexts.** Pass if the UI stays legible with `data-theme` light/dark × `data-contrast`
   standard/medium/high, with body text at 4.5:1 or more and meaningful graphics at 3:1 or more. Measure with the
   rendered colors. Fail if a theme island or scoped scheme lets its text inherit a color resolved in the parent's
   theme (the element must set its own `background` and `color`), or if no in-app setting reaches medium and returns
   to System ([Appearance settings](#appearance-settings)).
4. **Boundaries.** Pass if interactive targets whose fill is under 3:1 against the background have a boundary of
   `outline` (or another role with 3:1). Fail if `outline-variant` is the only cue.
5. **Surface hierarchy.** Pass if the body uses `surface`, regions use surface-container roles, nested or overlapping
   containers use different roles, and a region keeps its role across breakpoints. On a full-screen grouped list,
   every pair of neighbors (body, region, groups, key group, app bar at rest and scrolled) must differ in both themes,
   as in [the recipe](#a-grouped-list-screen-settings). Fail on surface-tint overlays or new uses of `background`,
   `on-background` or `surface-variant`.
6. **Emphasis.** Pass if the key action or takeaway of each region clearly stands apart through accent-role or
   surface-tone contrast (heuristic: at most one `primary`-filled element per region), and the key content sits on
   the brightest surface in use, in both themes.
7. **Custom colors.** Pass if each custom color has four roles × two themes × three contrast levels, a product
   prefix (not `--md-` or `--m3e-`), and harmonization except for literal colors. Fail on a custom red that
   duplicates `error`.
8. **Scrim.** Pass if modal backdrops use `--md-sys-color-scrim` at 32% (`--m3e-scrim`).
9. **Generated schemes.** Pass if non-baseline schemes come from `scripts/generate-scheme.mjs` or other
   `DynamicScheme`-based code (not `themeFromSourceColor`), include all 48 per-context roles at all three levels, and
   load after the token file.
10. **Forced colors.** Pass if, with forced colors emulated (DevTools: Rendering > Emulate CSS media feature
    forced-colors), every control boundary, selection state and focus ring is still visible.

## Sources

- https://m3.material.io/styles/color/system/overview
- https://m3.material.io/styles/color/system/how-the-system-works
- https://m3.material.io/styles/color/roles
- https://m3.material.io/styles/color/choosing-a-scheme
- https://m3.material.io/styles/color/static/baseline
- https://m3.material.io/styles/color/static/custom-brand
- https://m3.material.io/styles/color/dynamic/choosing-a-source
- https://m3.material.io/styles/color/dynamic/user-generated-source
- https://m3.material.io/styles/color/dynamic/content-based-source
- https://m3.material.io/styles/color/advanced/apply-colors
- https://m3.material.io/styles/color/advanced/define-new-colors
- https://m3.material.io/styles/color/advanced/adjust-existing-colors
- https://m3.material.io/foundations/designing/color-contrast
- https://m3.material.io/styles/elevation/applying-elevation
- https://m3.material.io/blog/building-with-m3-expressive
- https://m3.material.io/blog/tone-based-surface-color-m3
- https://m3.material.io/blog/science-of-color-design
- https://m3.material.io/blog/dynamic-color-harmony
- https://m3.material.io/blog/material-theme-builder-2-color-match
- https://m3.material.io/blog/android-stable-release-1-12-0
- https://m3.material.io/develop/web
- https://github.com/material-foundation/material-color-utilities
- https://www.npmjs.com/package/@material/material-color-utilities
- https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
- https://www.w3.org/TR/WCAG22/#contrast-minimum
- https://www.androidauthority.com/material-3-expressive-color-3560841/ (third-party report on Android 16 QPR1 dynamic color)
- https://android-developers.googleblog.com/2025/08/introducing-material-3-expressive-for-wear-os.html
- https://github.com/jordond/MaterialKolor (third-party; links the 2025 spec to "Material 3 Expressive")
