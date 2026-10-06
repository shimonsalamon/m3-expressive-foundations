# Typography

Typography turns reading order into structure. A small, fixed set of named styles tells people which
text is a page title, which is a paragraph and which is a button, and the names keep that meaning
on every screen size. M3 Expressive (May 2025) left the 15 baseline styles untouched and added 15
heavier *emphasized* twins for selected states, key actions and headlines. The token database
also holds variable-font data the site does not yet explain, and an August 2026 update added
line heights that grow for taller scripts. On the web, apply every style through the
`--md-sys-typescale-*` custom properties in `assets/m3-expressive-tokens.css`. They are in rem,
so text follows the user's font-size setting.

## Contents

1. [Key ideas](#key-ideas)
2. [What M3 Expressive changed](#what-m3-expressive-changed)
3. [The type scale](#the-type-scale): roles, baseline values, how the scale is built
4. [Emphasized styles](#emphasized-styles)
5. [Typefaces](#typefaces): brand and plain, the Roboto families, choosing a setup
6. [Variable fonts and axes](#variable-fonts-and-axes)
7. [Language height](#language-height)
8. [Readability](#readability): line length (the skill's measured cap), line height, numbers, case
9. [Editorial treatments](#editorial-treatments)
10. [Accessibility](#accessibility)
11. [Applying it on the web](#applying-it-on-the-web): loading fonts (also
    [self-hosted and offline](#self-hosted-and-offline-fonts)), role classes, emphasized overrides,
    Roboto Flex, language height, readable blocks
12. [Data quirks and source conflicts](#data-quirks-and-source-conflicts)
13. [Do and don't](#do-and-dont)
14. [Auditing](#auditing)
15. [Sources](#sources)

## Key ideas

- **Pick a style by purpose, never by pixel size.** There are five roles (display, headline, title,
  body, label) in three sizes each. The role name records what the text does, so a product can
  retune sizes for a device class without re-deciding every element.
- **A style is five properties, applied together.** These are family, weight, size, line height and
  tracking. The line-height tokens are lengths (`1.5rem`), not ratios. A child that changes only
  `font-size` therefore keeps its parent's line box. Set all five on every element that uses a role.
- **Emphasized styles are accents.** Each one has the size, line height and tracking of its baseline
  twin and only a heavier weight. They flag what is selected, unread or the main action. If
  everything is emphasized, nothing stands out.
- **Static Roboto is the default and Roboto Flex is opt-in.** Material still describes the variable
  face as outside the official scale, although its token database now holds variable-font data.
  The token file exposes it as `data-typeface="variable"`.
- **Text must scale with the reader.** Tokens are rem, the root size stays at the browser default,
  and containers grow with their text (padding plus `min-block-size`, not fixed heights).
- **Tall scripts need tall lines.** Burmese set in a line box sized for Latin collides with the
  lines around it. The language-height switch moves every line-height token together.
- **Expression belongs at the top of the scale.** Display and headline can carry character. Body
  and label have to stay plain and legible. Editorial showpieces are rare on purpose: one or two per
  product.

## What M3 Expressive changed

| When | Change | Status |
|---|---|---|
| May 2025 | The scale grows from 15 to 30 styles: 15 baseline plus 15 **emphasized** styles (`md.sys.typescale.emphasized.<role>.*`). In the third-party (3P) Roboto data only the weight differs: 400→500, or 500→700 for title-medium, title-small and label-*. | New |
| With Expressive | Guidance for where emphasized styles go: selection, actions, headlines, editorial moments, and components such as badges, primary buttons, extended FABs and selected list or menu items. Components don't switch to them on their own. | New |
| With Expressive | Guidance for **editorial treatments**: type-led hero moments built with variable-font axes. | New page |
| 2024-08 (DSDB) | Every style gains per-axis tokens (`wght`, `wdth`, `opsz`, `grad`, `rond`, `slnt`, `crsv`, `hexp`, `fill`) and a `Font` context: Static = Roboto, Variable = Roboto Flex with tracking 0. | The type-scale page mentions per-axis tokens; the `Font` context is DSDB-only; neither is in the official web library |
| 2026-03 (DSDB) | Two more sets, **Type scale - Variable** and **Type scale - Variable Emphasized** (`md.sys.typescale.variable[.emphasized].<role>.*`), plus new reference tokens: `md.ref.typeface.weight-semibold` (600), `md.ref.typeface.variable.{brand,plain}` and `md.ref.typeface.variable.wght-*`. | The two sets are DSDB only: no page shows or describes them. The reference tokens appear in the type-scale page's "Fonts & weights" viewer (with first-party values) but no text explains them. |
| 2026-05 (DSDB) | `md.ref.typeface.emphasized.rond` (0 for 3P, 100 for Google's own apps) and an iOS "Bold" weight setting. | The viewer lists the roundness token; the iOS setting is DSDB only. Neither applies to 3P web. |
| Aug 2026 | **Language height**: four line-height categories (small, medium, large, extra large) chosen by script, as `md.ref.typeface.<role>.line-height`. | New |
| Unchanged | The 15 baseline sizes, line heights, weights and tracking, the role names, brand/plain typefaces, the Major Second scale and the rem conversion. Static Roboto stays the default for components. | Unchanged |
| Web status | The overview's availability table lists "Web: Available" and "Web: Expressive: Unavailable". material-web ships baseline tokens only. The token file's `--md-sys-typescale-emphasized-*` names follow the DSDB token names; they are not an official web API. | Expressive not official on web |

## The type scale

### Roles

| Role | Sizes L / M / S | Use it for | Typeface token | Keep it away from |
|---|---|---|---|---|
| Display | 57 / 45 / 36px | The largest text on a screen: a short statement, a hero number. Works best on large screens. | brand | Paragraphs; anything longer than a line or two |
| Headline | 32 / 28 / 24px | Short, high-emphasis text that opens a major region, especially on compact screens. Also labels on the largest Expressive buttons. | brand | Long passages |
| Title | 22 / 16 / 14px | Short, medium-emphasis text for secondary regions: app bar titles, category and section headers. Also labels on larger Expressive buttons. | brand (large); plain (medium, small) | Long passages. Display, script or handwritten faces only with care |
| Body | 16 / 14 / 12px | Running text and longer passages. | plain | Any expressive or decorative face; button labels |
| Label | 14 / 12 / 11px | Small functional text inside components and small content text: text on small buttons (label-large), navigation bar labels, captions, timecodes. | plain | Paragraphs |

Choosing well:

- **Use as few styles as the content needs.** Few products need all 15. Material's own example
  trims the scale to five sizes. Every extra style is one more level readers have to decode.
- **Make adjacent levels clearly different.** Two sizes a pixel or two apart look like a mistake,
  not like hierarchy.
- **Let size and legibility rank importance.** The largest, clearest text should be the primary
  thing on the screen, and smaller text carries secondary and tertiary actions. Give content of
  the same kind the same style so readers see it as a group.
- **Use expressive faces only from headline up.** Title tolerates them with care. Keep them off
  body and label: body is read at length and label has to be read at a glance, both at small
  sizes where decorative shapes lose legibility first.
- **Button labels scale with the button.** Small buttons take label-large, or its emphasized twin
  for the primary action. Larger Expressive buttons can step up to a title or headline role so
  the label stays in proportion to a taller container. Illustrative (component value): Compose
  sets a medium button's label in title-medium. Take exact per-size styles from the component
  pages at https://m3.material.io/components.

### Baseline values

Each prefix expands to five custom properties: `-font`, `-weight`, `-size`, `-line-height` and
`-tracking`. Values are shown as they appear in the token file (rem) with px alongside. "Ratio" is
line height ÷ size.

| Style | Custom property prefix | Size | Line height (ratio) | Weight | Tracking | Face |
|---|---|---|---|---|---|---|
| display-large | `--md-sys-typescale-display-large-*` | 3.5625rem (57px) | 4rem (64px), 1.123 | 400 | -0.015625rem (-0.25px) | brand |
| display-medium | `--md-sys-typescale-display-medium-*` | 2.8125rem (45px) | 3.25rem (52px), 1.156 | 400 | 0rem | brand |
| display-small | `--md-sys-typescale-display-small-*` | 2.25rem (36px) | 2.75rem (44px), 1.222 | 400 | 0rem | brand |
| headline-large | `--md-sys-typescale-headline-large-*` | 2rem (32px) | 2.5rem (40px), 1.25 | 400 | 0rem | brand |
| headline-medium | `--md-sys-typescale-headline-medium-*` | 1.75rem (28px) | 2.25rem (36px), 1.286 | 400 | 0rem | brand |
| headline-small | `--md-sys-typescale-headline-small-*` | 1.5rem (24px) | 2rem (32px), 1.333 | 400 | 0rem | brand |
| title-large | `--md-sys-typescale-title-large-*` | 1.375rem (22px) | 1.75rem (28px), 1.273 | 400 | 0rem | brand |
| title-medium | `--md-sys-typescale-title-medium-*` | 1rem (16px) | 1.5rem (24px), 1.5 | 500 | 0.009375rem (0.15px) | plain |
| title-small | `--md-sys-typescale-title-small-*` | 0.875rem (14px) | 1.25rem (20px), 1.429 | 500 | 0.00625rem (0.1px) | plain |
| body-large | `--md-sys-typescale-body-large-*` | 1rem (16px) | 1.5rem (24px), 1.5 | 400 | 0.03125rem (0.5px) | plain |
| body-medium | `--md-sys-typescale-body-medium-*` | 0.875rem (14px) | 1.25rem (20px), 1.429 | 400 | 0.015625rem (0.25px) | plain |
| body-small | `--md-sys-typescale-body-small-*` | 0.75rem (12px) | 1rem (16px), 1.333 | 400 | 0.025rem (0.4px) | plain |
| label-large | `--md-sys-typescale-label-large-*` | 0.875rem (14px) | 1.25rem (20px), 1.429 | 500 | 0.00625rem (0.1px) | plain |
| label-medium | `--md-sys-typescale-label-medium-*` | 0.75rem (12px) | 1rem (16px), 1.333 | 500 | 0.03125rem (0.5px) | plain |
| label-small | `--md-sys-typescale-label-small-*` | 0.6875rem (11px) | 1rem (16px), 1.455 | 500 | 0.03125rem (0.5px) | plain |

The `-weight` tokens point at reference weights and the `-font` tokens point at brand or plain:

| Token | CSS custom property | Value in the token file | Use |
|---|---|---|---|
| `md.ref.typeface.brand` | `--md-ref-typeface-brand` | `Roboto, "Noto Sans", sans-serif` | display-*, headline-*, title-large (baseline and emphasized). The DSDB value is `Roboto`; the token file appends the fallbacks. |
| `md.ref.typeface.plain` | `--md-ref-typeface-plain` | `Roboto, "Noto Sans", sans-serif` | title-medium, title-small, body-*, label-* |
| `md.ref.typeface.weight-regular` | `--md-ref-typeface-weight-regular` | 400 | Baseline display, headline, title-large, body |
| `md.ref.typeface.weight-medium` | `--md-ref-typeface-weight-medium` | 500 | Baseline title-medium/small and label; emphasized display, headline, title-large, body |
| `md.ref.typeface.weight-semibold` | `--md-ref-typeface-weight-semibold` | 600 | New in 2026 and absent from material-web, Compose and MDC (the site's viewer lists it). On the web only the DSDB-only Variable Emphasized set uses it; no static style does. |
| `md.ref.typeface.weight-bold` | `--md-ref-typeface-weight-bold` | 700 | Emphasized title-medium/small and label; prominent label weights |
| `md.sys.typescale.label-large.weight.prominent` | `--md-sys-typescale-label-large-weight-prominent` | 700 | Pre-Expressive bold label variant (material-web class `.md-typescale-label-large-prominent`) |
| `md.sys.typescale.label-medium.weight.prominent` | `--md-sys-typescale-label-medium-weight-prominent` | 700 | Same, for label-medium |

The `md.ref.typeface.<role>.line-height` tokens (`--md-ref-typeface-<role>-line-height`) hold the
language-height values; see [Language height](#language-height).

### How the scale is built

- The ratio is a Major Second (1.125), keyed to 14px, the size used most for body text.
  14 × 1.125ⁿ rounds to 11, 12, 14, 16, 22, 28, 32, 36, 45 and 57. The exception is 24
  (headline-small), which sits between two steps. The ratio describes the intent; the token values
  are what count.
- **To customize, change the least you can.** Changing the typeface means changing
  `--md-ref-typeface-brand` and `--md-ref-typeface-plain`. Then tune line height and tracking for
  the new face: heavier faces often need more letter spacing, and faces with long ascenders or
  descenders need their line heights re-tuned. Leave sizes alone where you can, because components
  are laid out around them. Apply the same changes to the emphasized set.
- **When a size must change** (a TV, a kiosk), move that role to another Major Second step instead
  of an arbitrary number. Any customization can cut you off from Material's future typography
  token updates, so record what you changed.

## Emphasized styles

Emphasized styles are heavier versions of the baseline styles, meant to be mixed with them rather
than to replace them. Material's web library has no emphasized tokens yet; the
`--md-sys-typescale-emphasized-*` names below are the token file's rendering of the DSDB names.
In the 3P (Roboto) data, weight is the only property that differs:

| Emphasized styles | Custom property prefix | Weight (baseline → emphasized) | Size, line height, tracking |
|---|---|---|---|
| display-large/medium/small | `--md-sys-typescale-emphasized-display-<size>-*` | 400 → 500 | identical to baseline |
| headline-large/medium/small | `--md-sys-typescale-emphasized-headline-<size>-*` | 400 → 500 | identical |
| title-large | `--md-sys-typescale-emphasized-title-large-*` | 400 → 500 | identical |
| title-medium, title-small | `--md-sys-typescale-emphasized-title-<size>-*` | 500 → 700 (semibold 600 is skipped) | identical |
| body-large/medium/small | `--md-sys-typescale-emphasized-body-<size>-*` | 400 → 500 | identical |
| label-large/medium/small | `--md-sys-typescale-emphasized-label-<size>-*` | 500 → 700 | identical |

**When to use them.** Two triggers apply, and they can apply together:

- **Weight-driven:** text your design already sets in medium or bold moves to the emphasized twin,
  so the heavier look comes from a token instead of a one-off `font-weight`.
- **Context-driven:** a state or moment deserves attention. Examples are the selected tab,
  navigation item, list item or menu item, an unread conversation, a primary-action button or
  extended FAB label, a badge, a hero headline, or an editorial moment.

**How.** Replace the baseline token with the emphasized token of the same role and size. For
example, `title-medium` becomes `emphasized-title-medium` when a list item is selected. Keep the
role and size fixed, because only the weight should move.

**Limits.**

- Emphasis only works against a quieter baseline, so keep emphasized styles off body copy by
  default, off every item in a list, and off all navigation labels at once.
- Emphasized label-medium and label-small are 700 at 12 and 11px. The editorial guidance warns
  that heavy weights at small sizes read poorly, so keep those two for single, meaningful states.
- A weight change widens text by about 1.4% per 100 units of weight (measured in Roboto Flex at
  16px). Neighbors shift when a tab or chip becomes emphasized unless you reserve the width; see
  [Emphasized overrides](#3-emphasized-overrides).
- If you customize the set, keep all emphasized styles consistent with each other (for example,
  all of them wider than baseline). The emphasized set may even use a different typeface from the
  baseline set.

## Typefaces

### Brand and plain

- **Brand** carries expression at large sizes. It serves display-*, headline-* and title-large.
- **Plain** carries readability at small sizes. It serves title-medium, title-small, body-* and
  label-*.
- Both default to Roboto. The mapping is identical for baseline and emphasized styles on Web,
  Android and Compose. A rule like "all titles use brand" is wrong on the web: only title-large
  does. The DSDB switches title-medium, title-small and label-large to brand only for iOS.
- Swap faces by overriding the two reference tokens on `:root`. The `--md-sys-*` tokens there
  resolve against them. See [Brand typeface swap](#brand-typeface-swap).

### The Roboto families

| Family | Kind | Axes (Google Fonts) | Coverage | Role in M3 |
|---|---|---|---|---|
| Roboto | Static in M3's definition; Google Fonts now serves it as a variable font | wght 100–900, wdth 75–100 | 3,300+ glyphs, hundreds of languages | The default for every style and component |
| Roboto Flex | Variable | 13 axes (table below) | 900+ glyphs: Latin, Greek, Cyrillic (Google Fonts also ships a Vietnamese subset) | Optional; `data-typeface="variable"` |
| Roboto Serif | Variable | wght 100–900, wdth 50–150, opsz 8–144, GRAD -50–100 | not specified by M3 | A serif for comfortable reading that also works in UI; a candidate brand face for long-form or editorial products |
| Roboto Mono | Monospaced | wght 100–700 (M3 also lists italic) | not specified by M3 | Code and columns of aligned numbers |
| Noto Sans | Variable | wdth 62.5–100, wght 100–900 | 150+ scripts across the Noto collection | Fallback for scripts Roboto lacks |

- **Fallback order:** Roboto Flex → Roboto → Noto Sans → generic `sans-serif`. The token file
  encodes this order. Check that the fallback actually loads: an unloaded Roboto only helps if it
  is installed locally with all three weights, and a partial install is no better than none. Pages
  that must work offline ship the font themselves; see
  [Self-hosted and offline fonts](#self-hosted-and-offline-fonts).
- **Script-specific Noto families** (Noto Sans JP, Noto Sans Arabic, ...) are separate downloads
  on Google Fonts. Add the one your content needs to the stack; see
  [Brand typeface swap](#brand-typeface-swap).
- **Google's own apps** use Google Sans, Google Sans Text and Google Sans Flex. The token viewers on
  m3.material.io display those first-party values (Google Sans, tracking 0), because that is the
  database's default context. Don't copy numbers from the site's viewers. Use the token file,
  which holds the 3P Roboto values.

### Choosing a setup

This is the skill's decision guide, built from the points above.

| Situation | Setup | Why |
|---|---|---|
| Ordinary product UI | Static Roboto at 400, 500 and 700 (the default) | M3 components use it by default, and three weights cover all 30 styles. |
| Grade-based states, dark-mode compensation, optical sizing or an editorial moment | `data-typeface="variable"` plus Roboto Flex loaded with `opsz` (and `GRAD` if you use grade) | Only a variable face has these axes. Material still treats it as an option, so opt in deliberately. |
| A brand face | Override `--md-ref-typeface-brand` (display, headline, title-large), and `-plain` only if the brand face reads well small | Brand carries expression at large sizes; plain has to stay readable at 11–16px. |
| Content outside Latin, Greek and Cyrillic | Add the script's Noto family to the stacks, set `lang`, and apply language height | Roboto Flex covers only those three scripts, and taller scripts need taller lines. |

## Variable fonts and axes

### Roboto Flex axes

| Axis | Min / default / max | Set it with | What it changes |
|---|---|---|---|
| `wght` weight | 100 / 400 / 1000 | `font-weight` | Stroke thickness; also widens letters |
| `wdth` width | 25 / 100 / 151 | `font-stretch` (percent) | Horizontal space per letter |
| `opsz` optical size | 8 / 14 / 144 | `font-optical-sizing: auto` | Letter design tuned for the rendered size |
| `GRAD` grade | -200 / 0 / 150 | `font-variation-settings: "GRAD" n` | Apparent weight **without** changing widths or line breaks |
| `slnt` slant | -10 / 0 / 0 | `font-style: oblique 10deg` | Lean to the right (Roboto Flex has no italic; slant replaces it) |
| `XOPQ`, `YOPQ` | 27/96/175, 25/79/135 | `font-variation-settings` | Thick and thin stroke contrast |
| `XTRA` | 323 / 468 / 603 | `font-variation-settings` | Counter width |
| `YTUC`, `YTLC` | 528/712/760, 416/514/570 | `font-variation-settings` | Uppercase and lowercase height |
| `YTAS`, `YTDE`, `YTFI` | 649/750/854, -305/-203/-98, 560/738/788 | `font-variation-settings` | Ascender height, descender depth, figure height |

- Roboto Flex has **no** `ROND`, `CRSV`, `HEXP` or `FILL` axis. The DSDB tokens for those axes do
  nothing with it, and asking the Google Fonts API for `ROND` returns HTTP 400.
- Use the high-level CSS property wherever one exists (`font-weight`, `font-stretch`, `font-style`,
  `font-optical-sizing`). Keep `font-variation-settings` for `GRAD` and the parametric axes. It
  overrides the high-level properties, so a stray `"wght"` there silently wins over `font-weight`.
- Figures are tabular by default in the current Google Fonts build, and the font has no `tnum`
  feature. Aligned numbers therefore need no extra setting. A 2022 Material blog post says the
  default switched to proportional, but the current font file measured tabular in Chromium.

### Axis guidance

- **Weight:** the most direct thickness control. Save very light weights for large display text,
  because thin strokes break up at small sizes on low-resolution screens. Very heavy weights
  at small sizes (all-bold navigation labels, for example) also hurt legibility.
- **Grade:** a finer thickness adjustment that leaves letter widths alone, so nothing reflows. Use
  it for state changes, such as a heavier grade on a selected filter chip. It also counteracts the
  way the same text can look heavier after a light/dark switch. Material doesn't say which mode
  looks heavier. Its icon guidance lowers grade for light-on-dark icons (-25), which suggests dark
  mode, so a small negative grade there is a reasonable starting point.
- **Width:** narrow widths fit more characters and suit small labels. Wide widths add personality,
  but don't use them in cramped places such as a top app bar.
- **Optical size:** match it to the rendered size and never use a large optical size for small
  text. `font-optical-sizing: auto` does this for you. In Chromium, `auto` rendered display-large
  text 14.5% narrower than `none` (which falls back to the 14px design).

### Variable-font tokens in the database

The DSDB holds more variable-font data than the site documents. What exists, and what the token
file ships:

| Data | Token names | 3P values | In the token file? |
|---|---|---|---|
| Per-axis tokens for all 30 styles (DSDB, 2024-08) | `md.sys.typescale[.emphasized].<role>.{wght,wdth,opsz,grad,rond,slnt,crsv,hexp,fill}` | `wght` = the weight (except quirk Q1), `wdth` 100, `opsz` = size in px, everything else 0 (except quirk Q2) | No. Use the high-level CSS properties and `font-optical-sizing: auto`, which give the same rendering apart from Q1. |
| `Font=Variable` context | The ordinary sys tokens under that context | Family Roboto Flex; tracking 0 for every style; weights unchanged | Yes: `[data-typeface="variable"]` swaps both reference faces and zeroes all 30 tracking tokens. |
| Type scale - Variable | `md.sys.typescale.variable.<role>.*` | Roboto Flex; baseline sizes, line heights and weights; tracking 0; `opsz` undefined on Web | No (DSDB only, not shown on any page) |
| Type scale - Variable Emphasized | `md.sys.typescale.variable.emphasized.<role>.*` | Like the Variable set with emphasized weights, **except** title-medium, title-small and label-* use 600 (semibold), not 700 | No (DSDB only) |
| Variable reference tokens | `md.ref.typeface.variable.{brand,plain}`, `md.ref.typeface.variable.wght-{regular,medium,semibold,bold}` | Roboto Flex; 400 / 500 / 600 / 700 | No. Only the related weight token `md.ref.typeface.weight-semibold` ships, as `--md-ref-typeface-weight-semibold` (600). |

The site says Roboto Flex is "not yet part of the M3 typescale", while the DSDB maps every role to
it under `Font=Variable`. Treat static Roboto as the default and the variable scale as an option.
If you want the Variable Emphasized weights, see
[Roboto Flex setup](#4-roboto-flex-axes-in-css).

## Language height

Scripts differ in how tall their glyphs are. A line box sized for Latin clips or crowds Burmese,
Telugu or Nastaliq. The August 2026 update assigns each script to a height category and gives
every role a line height per category. Components with vertical padding grow automatically.
Fixed-height components are built for Small and may clip.

| Category | Scripts and languages | Taller than Small by (page figure / measured in tokens) |
|---|---|---|
| Small | Latin (except Vietnamese), Greek, Cyrillic, Hebrew | the base |
| Medium | Amharic, Arabic, Armenian, Bangla, Chinese, Gujarati, Hindi, Japanese, Kannada, Khmer, Korean, Lao, Malayalam, Odia, Punjabi, Sinhala, Tamil, Thai, Vietnamese and most others | ~7% / 5.0–15.0% |
| Large | Burmese, Telugu | ~30% / 25.0–39.1% |
| Extra large | Nastaliq | ~100% / 70.8–90.4% |

Line-height values (`--md-ref-typeface-<role>-line-height`; the switch also rewrites the matching
`--md-sys-typescale-<role>-line-height` and `--md-sys-typescale-emphasized-<role>-line-height`):

| Role | Small | Medium | Large | Extra large |
|---|---|---|---|---|
| display-large | 4rem (64px) | 4.5625rem (73px) | 5.5625rem (89px) | 7.5rem (120px) |
| display-medium | 3.25rem (52px) | 3.5rem (56px) | 4.4375rem (71px) | 6.1875rem (99px) |
| display-small | 2.75rem (44px) | 2.9375rem (47px) | 3.5625rem (57px) | 5rem (80px) |
| headline-large | 2.5rem (40px) | 2.625rem (42px) | 3.125rem (50px) | 4.6875rem (75px) |
| headline-medium | 2.25rem (36px) | 2.375rem (38px) | 2.8125rem (45px) | 4.125rem (66px) |
| headline-small | 2rem (32px) | 2.1875rem (35px) | 2.5625rem (41px) | 3.6875rem (59px) |
| title-large | 1.75rem (28px) | 1.9375rem (31px) | 2.25rem (36px) | 3.3125rem (53px) |
| title-medium | 1.5rem (24px) | 1.6875rem (27px) | 1.9375rem (31px) | 2.625rem (42px) |
| title-small | 1.25rem (20px) | 1.4375rem (23px) | 1.625rem (26px) | 2.25rem (36px) |
| body-large | 1.5rem (24px) | 1.6875rem (27px) | 1.9375rem (31px) | 2.5625rem (41px) |
| body-medium | 1.25rem (20px) | 1.4375rem (23px) | 1.625rem (26px) | 2.1875rem (35px) |
| body-small | 1rem (16px) | 1.125rem (18px) | 1.3125rem (21px) | 1.875rem (30px) |
| label-large | 1.25rem (20px) | 1.4375rem (23px) | 1.625rem (26px) | 2.25rem (36px) |
| label-medium | 1rem (16px) | 1.125rem (18px) | 1.3125rem (21px) | 1.875rem (30px) |
| label-small | 1rem (16px) | 1.125rem (18px) | 1.3125rem (21px) | 1.8125rem (29px) |

How the token file switches:

- **Explicit:** set `data-language-height="small" | "medium" | "large" | "extra-large"` on `<html>`
  or on any subtree.
- **Automatic:** when `<html>` has no such attribute, its `lang` picks Medium for am, ar, hy, bn,
  zh, gu, hi, ja, kn, km, ko, lo, ml, or, pa, si, ta, th and vi, and Large for my and te.
  Everything else stays Small. Only `<html lang>` is read: an embedded run in another language
  needs its own `data-language-height`.
- **Extra large is never automatic.** Nastaliq is a writing style, not a language (Urdu can be set
  in Naskh too). Opt in when your font is actually a Nastaliq face.
- **Unlisted languages:** Material recommends Medium as the default, because most languages fall
  there, and switching once the language is detected. The DSDB default, and the token file's
  default, is Small. So set Medium explicitly for Medium-script languages the automatic list
  misses, such as Persian, Urdu, Nepali, Marathi or Georgian; unlisted languages written in Latin,
  Greek, Cyrillic or Hebrew stay Small. Keep Medium as the blanket choice only for content whose
  language is unknown. The script-based helper in
  [Language height in practice](#5-language-height-in-practice) does this for you.
- **Mixed-script blocks:** the block's line height applies to every line, so pick the category of
  the tallest script present. Or give the embedded run its own `lang` and role declaration.
  Inheriting is not enough, because line height inherits as a fixed length.

## Readability

- **Line length:** keep body text between 40 and 60 characters per line at every breakpoint. The
  figures here are the skill's single source for line length; `layout.md` and the TYP-16 check
  point to them. The `ch` unit is the advance width of "0", which is wider than an average Roboto
  letter even after body-large's 0.5px tracking. Measured in Chromium on English prose set in
  Roboto body-large (16px, 0.5px tracking), a `60ch` column held 63–70 characters per line, too
  many, and `50ch` held 53–59. **Cap body text at `max-inline-size: 50ch`.** The 40-character
  lower end arrives at about `36ch`. Declare the cap on the element that carries the body role,
  because `ch` follows that element's own font size, and measure again if you change the face,
  size, tracking or language.
- **Line height:** use the token values. The applying-type page gives rules of thumb (1.2× for
  display, headline and title; around 1.5× for body and label), but the tokens differ: 1.123–1.333
  for display, headline and title-large, and 1.333–1.5 for title-medium, title-small, body and
  label. Never let role text fall back to `line-height: normal`.
- **Web leading:** CSS centers each line in its line box (half-leading). Measure spacing from
  container edges, not from baselines as Android specs do.
- **Display clipping:** display-large (1.123) and display-medium (1.156) have line boxes shorter
  than Roboto's content area (1.172× the size). Accents and tall glyphs can be cut off by an
  `overflow: hidden` box sized to the line height, so give display text some block padding.
- **Numbers:** use tabular figures in tables, timers, clocks and counters so digits don't jitter.
- **Icons inside text:** size a Material Symbol to the text size and match its optical weight
  (and grade, if the text uses one). Shift the symbol's baseline down by about 11.5% of the text
  size; Material marks sharing the text's baseline as a don't.
- **Case:** keep text as written. The only case token is `label-medium.text-transform = none`, and
  Android sets no all-caps on any style. Don't add `text-transform: uppercase` to roles.
- **Color:** body text uses on-surface, or on-surface-variant for a softer secondary level. Links
  in running text use primary (tertiary for less prominence) and are underlined. See `color.md`.
- **Density and breakpoints:** a denser component keeps its text size. Across breakpoints, a
  layout may switch a region to a different role; see `layout.md`.

## Editorial treatments

An editorial treatment is a self-contained moment led by type: an oversized or unusually shaped
headline that departs from a functional layout. In M3 Expressive they combine with motion, shape
and color to create hero moments.

- **Purposes:** celebrating something (a finished task, a memory, a milestone), the user's own voice
  (personalized type, or text that reacts to input), and bespoke controls where type is the
  feedback (a slider that drives width and weight).
- **Restraint:** one or two hero moments per product. They work because they are brief and
  unexpected; several at once compete for attention and tire the reader.
- **Match the tone to the task.** A narrow, light setting reads as calm. A heavy, slanted setting
  reads as lively.
- **Tokenize each treatment** and reuse it wherever the same kind of moment recurs, so similar
  moments look alike.
- **Don'ts:** don't combine several clashing treatments in one layout. Don't imitate the user's
  personalization theming. Don't apply editorial type to labels or to text that only informs.
- **Sizing:** fluid sizes (`clamp()`) are this skill's proposal for editorial display type only,
  always with a rem floor and a rem term so zoom and the font-size setting still apply. For UI
  text, switch roles at breakpoints instead.

## Accessibility

- **Scaling:** all type tokens are rem. Don't set `html { font-size }` in px, and don't use the
  62.5% trick: a px root ignores the user's setting, and 62.5% breaks every token's px mapping.
  Test at 200% text size (WCAG 1.4.4) with both the browser font-size setting and zoom.
- **Text spacing (WCAG 1.4.12):** layouts must survive line height 1.5×, paragraph spacing 2×,
  letter spacing 0.12× and word spacing 0.16× the font size without clipping or overlap. Size
  text containers with padding and `min-block-size`.
- **Contrast:** 4.5:1 for normal text and 3:1 for large text. Large means 18pt (24px) regular or
  14pt (18.67px) bold, in WCAG points. At their token weights, only headline-small (24px) and
  larger roles qualify, so title-large (22px) needs 4.5:1. Disabled text is exempt.
- **Minimum size:** M3 states no minimum. The smallest token is label-small at 11px (0.6875rem) and
  the smallest body style is 12px. This skill treats 11px as the floor, because nothing in the
  scale goes lower.
- **Viewport units:** a `font-size` in `vw` alone fails WCAG 1.4.4 (failure F94), so mix in rem.
- **Bold-text preference:** the DSDB's iOS "Bold" setting (+100 on every reference weight) has no
  standard CSS equivalent. On the web, respect font size and zoom.
- **Language:** set `<html lang>` and `lang` on embedded runs. Screen readers need it, and so do
  language height and glyph fallback.

## Applying it on the web

### 1. Load the fonts

Put the links right after `<meta charset>` and preconnect to both origins (gstatic needs
`crossorigin`). Request only the weights and axes you use.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Static scale: the three weights the 3P type scale uses -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
<!-- Optional Roboto Flex: opsz for automatic optical sizing, wght, and GRAD for grade effects -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght,GRAD@8..144,100..1000,-200..150&display=swap">
```

- **Load every weight a role uses:** 400, 500 and 700 for the static scale. A missing weight is
  faked by synthetic bolding, and `font-synthesis-weight: none` only swaps that for the nearest real
  weight, which can make an emphasized style look identical to its baseline twin.
- **Roboto as one variable file:** Google Fonts also serves Roboto as a variable font. Measured
  in September 2026 with a Chrome user agent, the `wght@400;500;700` request above returned a
  single latin file of 43,136 bytes that all three weights share, while a request for one weight
  alone returns a static file of about 22 KB. The full range
  (`family=Roboto:wdth,wght@75..100,100..900`) came to 66,544 bytes, so ask for it only when you
  use other weights or widths.
- **Roboto Flex axes:** an axis you don't request is frozen at its default. Without `opsz`,
  `font-optical-sizing: auto` does nothing and every size gets the 14px design. Add `wdth` (`25..151`)
  only if you use widths. Each axis costs size: latin woff2 files measured in September 2026 were
  about 34 KB for `wght`, 84 KB for `opsz,wght`, 241 KB for `opsz,wdth,wght,GRAD` and 326 KB for
  all 13 axes. Never request `ROND` (HTTP 400).
- **`display=`:** `swap` shows the web font as soon as it arrives but can shift layout, `optional`
  gives the least layout shift but some visitors never see the web font, and `fallback` sits
  between them. Pick deliberately. The `text=` parameter can shrink files a lot for fixed strings
  such as a hero numeral.

#### Self-hosted and offline fonts

The Google Fonts link needs a network. Offline, behind a firewall, or in a single HTML file that
may not fetch anything, the token stacks fall through to a locally installed Roboto (most Windows
and macOS machines have none), then Noto Sans, then the generic `sans-serif`. The generic face
often has no 500. In Chromium on Windows it is Arial, which has only regular and bold, so every
500 renders as 400: display, headline, title-large and body look exactly like their emphasized
twins, and title-medium, title-small and the labels lose their medium weight. Nothing looks
broken, yet emphasis is gone and TYP-09 fails. Ship the font with the page instead:

1. Open the CSS API URL you would have linked (`family=Roboto:wght@400;500;700`) in a current
   browser, download each woff2 file it lists (the latin block is usually enough), and copy its
   `@font-face` rules. Keep the family name `Roboto`, so the token stacks find it; a web font with
   that name takes precedence over any installed Roboto. Change only `src`.
2. For a single self-contained file, replace the URL with the file's bytes as a base64 `data:`
   URI. Base64 adds a third: the 43 KB latin file becomes about 58 KB of text.
3. Make sure 400, 500 and 700 are all covered. Emphasized styles need a face with a real 500
   weight; without one, baseline and emphasized styles collapse into the same look and no CSS
   property brings the difference back.

```html
<style>
  /* Self-hosted Roboto, latin subset: one variable file serves 400, 500 and 700.
     Single-file page: url("data:font/woff2;base64,...") with the file's bytes instead. */
  @font-face {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url("fonts/roboto-latin-400-700.woff2") format("woff2");
  }
</style>
```

- Google's CSS lists the shared variable file three times, once per weight. Copying those rules
  works; the single rule above with `font-weight: 400 700` is equivalent and also covers the
  weights in between.
- If the API hands you one static file per weight, write one `@font-face` per file, each with a
  single `font-weight` (400, 500, 700).
- A latin file covers Latin only. Add the subsets, or the script's Noto family, that your content
  needs, or those characters fall back to whatever the system has.
- Accepting a system fallback instead is a product decision. If you make it, check in DevTools
  (Computed › Rendered Fonts) that text at 500 renders from a different face than text at 400, and
  record the choice. The token file's stacks name no system face, and this skill endorses none.

### 2. Apply a role: utility classes

Apply the five longhands. A composite token cannot be one CSS value (the `font` shorthand has no
letter-spacing), and the shorthand also resets `font-variation-settings`, `font-optical-sizing` and
`font-variant-numeric`. The class names follow material-web's `.md-typescale-<role>` convention;
the `emphasized-` classes are this skill's extension of it.

```css
.md-typescale-title-large {
  font-family: var(--md-sys-typescale-title-large-font);
  font-weight: var(--md-sys-typescale-title-large-weight);
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);
  letter-spacing: var(--md-sys-typescale-title-large-tracking);
}
.md-typescale-emphasized-title-large {
  font-family: var(--md-sys-typescale-emphasized-title-large-font);
  font-weight: var(--md-sys-typescale-emphasized-title-large-weight);
  font-size: var(--md-sys-typescale-emphasized-title-large-size);
  line-height: var(--md-sys-typescale-emphasized-title-large-line-height);
  letter-spacing: var(--md-sys-typescale-emphasized-title-large-tracking);
}
```

The same five lines repeat for every style. This vanilla JS prints all 30 classes (run it once in
Node or the browser console and paste the output into your stylesheet):

```js
const roles = ['display', 'headline', 'title', 'body', 'label']
  .flatMap(r => ['large', 'medium', 'small'].map(s => `${r}-${s}`));
const props = { 'font-family': 'font', 'font-weight': 'weight', 'font-size': 'size',
  'line-height': 'line-height', 'letter-spacing': 'tracking' };
const css = ['', 'emphasized-'].flatMap(set => roles.map(role =>
  `.md-typescale-${set}${role} {\n` +
  Object.entries(props).map(([p, t]) => `  ${p}: var(--md-sys-typescale-${set}${role}-${t});`).join('\n') +
  '\n}')).join('\n');
console.log(css);
```

The `-font` tokens already include the fallback stack, so add nothing after the `var()`. The
token file sets custom properties only, so give `body` a default role yourself:

```css
body {
  font-family: var(--md-sys-typescale-body-large-font);
  font-weight: var(--md-sys-typescale-body-large-weight);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
  color: var(--md-sys-color-on-surface);
}
```

#### Brand typeface swap

```css
/* Override on :root, after the token file. The sys font tokens resolve on :root too.
   Load the face yourself (Roboto Serif and Noto Serif are on Google Fonts). */
:root {
  --md-ref-typeface-brand: "Roboto Serif", "Noto Serif", serif;
}
/* Japanese pages: add the script-specific Noto family to each stack (load Noto Sans JP too).
   Keep your brand face first if you swapped it above. */
:root:lang(ja) {
  --md-ref-typeface-brand: Roboto, "Noto Sans JP", "Noto Sans", sans-serif;
  --md-ref-typeface-plain: Roboto, "Noto Sans JP", "Noto Sans", sans-serif;
}
```

Cascade rules:

- A `var()` inside a custom property resolves on the element that declares it. Overriding
  `--md-ref-typeface-brand` on a subtree changes nothing, because the sys `-font` tokens were
  already resolved on `:root`. On a subtree, override the `--md-sys-typescale-*-font` tokens
  themselves. (`data-typeface="variable"` works on a subtree because the token file redeclares the
  sys `-font` tokens in that block.)
- `[data-typeface="variable"]` has the same specificity as `:root`, so when both set the reference
  faces on `<html>`, the rule that comes later wins. `:root:lang(ja)` is more specific than both
  and wins regardless of order, so put `"Roboto Flex"` first in it if you also use the variable
  face.

### 3. Emphasized overrides

In the 3P data only the weight changes, so a state rule can swap just the weight. If your
emphasized set uses a different typeface, swap the family as well.

```css
/* Selected navigation item and unread row: same role, emphasized weight */
.nav-item[aria-current="page"] .nav-item__label {
  font-weight: var(--md-sys-typescale-emphasized-label-medium-weight);
}
.thread[data-unread] .thread__subject {
  font-family: var(--md-sys-typescale-emphasized-title-medium-font);
  font-weight: var(--md-sys-typescale-emphasized-title-medium-weight);
}

/* Reserve the emphasized width so selecting a tab doesn't push its neighbours.
   Markup: <span class="tab__label" data-label="Photos">Photos</span> */
.tab__label {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.tab__label::after {
  content: attr(data-label);        /* fallback for browsers without alt-text syntax */
  content: attr(data-label) / "";   /* empty alt text; visibility: hidden already hides it from AT */
  block-size: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: var(--md-sys-typescale-emphasized-title-small-weight);
}
.tab[aria-selected="true"] .tab__label {
  font-weight: var(--md-sys-typescale-emphasized-title-small-weight);
}
```

With Roboto Flex you can skip the width reservation and use grade for the state instead, because
grade never changes widths (next section).

### 4. Roboto Flex: axes in CSS

`data-typeface="variable"` on `<html>` (or a subtree) switches both reference faces to
`"Roboto Flex", Roboto, "Noto Sans", sans-serif` and sets tracking to 0 for all 30 styles. That is
the DSDB's `Font=Variable` context. Weights stay the same. Load Roboto Flex with `opsz` yourself.

```css
/* Grade through one local helper (not a Material token). font-variation-settings replaces its
   whole axis list on each declaration, so build it in one place from variables. */
:root {
  --type-grad: 0;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --type-grad: -25; }  /* starting point borrowed from icon grade; tune by eye */
}
:root[data-theme="dark"] {
  --type-grad: -25;
}
/* The switch element (<html> or a subtree root) passes the setting down; .chip redeclares it. */
[data-typeface="variable"],
[data-typeface="variable"] .chip {
  font-optical-sizing: auto;  /* the initial value, stated so no later rule quietly sets none */
  font-variation-settings: "GRAD" var(--type-grad);
}
/* Selected filter chip (a toggle button) looks heavier without reflow. The declaration above
   sits on .chip itself, so the changed variable is picked up there. */
[data-typeface="variable"] .chip[aria-pressed="true"] {
  --type-grad: 100;
}
```

- **Don't put `wght`, `wdth`, `slnt` or `opsz` in `font-variation-settings`.** They override
  `font-weight`, `font-stretch` and `font-style`, and a pinned `opsz` stops following the size
  when the user enlarges text.
- **Inheritance:** `font-variation-settings` inherits as a resolved value. Declare it on the element
  whose variable changes, as with `.chip` above, not only on an ancestor.
- **Optional Variable Emphasized weights:** the DSDB-only set uses semibold for five roles.
  Opt in on the same element as the switch. `data-variable-emphasis` is a local attribute this
  snippet defines, not a token-file switch:

```css
[data-typeface="variable"][data-variable-emphasis="semibold"] {
  --md-sys-typescale-emphasized-title-medium-weight: var(--md-ref-typeface-weight-semibold);
  --md-sys-typescale-emphasized-title-small-weight: var(--md-ref-typeface-weight-semibold);
  --md-sys-typescale-emphasized-label-large-weight: var(--md-ref-typeface-weight-semibold);
  --md-sys-typescale-emphasized-label-medium-weight: var(--md-ref-typeface-weight-semibold);
  --md-sys-typescale-emphasized-label-small-weight: var(--md-ref-typeface-weight-semibold);
}
```

- **Animating axes:** `font-variation-settings` interpolates only when both keyframes list the same
  axes; otherwise it jumps. Animating `wght` or `wdth` reflows text on every frame, while `GRAD`
  does not. Respect reduced motion (see `motion.md`).

An editorial treatment built from local tokens (a proposal: Material asks you to create tokens for
treatments but defines none):

```css
:root {
  --editorial-celebrate-size: clamp(3.5625rem, 2.5rem + 5vw, 7rem);
  --editorial-celebrate-weight: 800;
  --editorial-celebrate-width: 125%;   /* needs the wdth axis in the font request */
}
.editorial-celebrate {
  font-family: "Roboto Flex", var(--md-sys-typescale-display-large-font);
  font-size: var(--editorial-celebrate-size);
  font-weight: var(--editorial-celebrate-weight);
  font-stretch: var(--editorial-celebrate-width);
  line-height: 1.12;                   /* close to display-large's 1.123; raise it for taller scripts */
  font-optical-sizing: auto;
  padding-block: 0.125em;              /* room for accents above the tight line box */
}
```

### 5. Language height in practice

```html
<html lang="fa" data-language-height="medium">   <!-- Persian: not in the automatic list -->
<!-- An embedded Burmese run. The role class is required: the element must re-apply the
     line-height token, because an inherited line height is already a fixed length. -->
<p lang="my" data-language-height="large" class="md-typescale-body-large">…</p>
```

Script-based helper for any language tag, including ones the automatic list misses. It uses the
likely script from `Intl.Locale`. Run it inline in `<head>` so the line heights are right before
first paint:

```js
const SMALL = new Set(['Latn', 'Grek', 'Cyrl', 'Hebr']);
const LARGE = new Set(['Mymr', 'Telu']);
function languageHeight(tag) {
  let loc;
  try { loc = new Intl.Locale(tag).maximize(); } catch { return 'medium'; }
  if (loc.script === 'Aran') return 'extra-large';   // only when the tag names Nastaliq, e.g. ur-Aran
  if (LARGE.has(loc.script)) return 'large';
  if (SMALL.has(loc.script) && loc.language !== 'vi') return 'small';
  return 'medium';                                   // Material's default for other scripts
}
const lang = document.documentElement.lang;
document.documentElement.dataset.languageHeight = lang ? languageHeight(lang) : 'medium';
```

Checked results: en, de, he, ru, mn, el and sr → small; vi, ka, hy, am, ja, zh, ko, th, hi, ar, fa,
ur and pa → medium; my and te → large; ur-Aran → extra-large.

### 6. Readable blocks

```css
.prose {
  max-inline-size: 50ch;        /* the skill's cap: 53-59 characters of body-large Roboto (see Readability) */
}
.prose a {
  color: var(--md-sys-color-primary);
  text-decoration-line: underline;
}
.numeric, table td, time {
  font-variant-numeric: tabular-nums;   /* documents intent; Roboto and Roboto Flex default to tabular */
}
.list-row {
  min-block-size: var(--m3e-min-target-size);        /* a floor (48px touch target), not a height */
  padding-block: var(--md-sys-measurement-space100); /* so the row grows with text size and language height */
}
```

## Data quirks and source conflicts

| # | Quirk | What to do |
|---|---|---|
| Q1 | **Emphasized weight vs `wght` axis.** For emphasized title-medium, title-small and label-*, the DSDB sets `.weight` to 700 but the `.wght` axis token to 600, in every context. The site's own viewer shows the same pair. The Variable Emphasized set uses 600 for both. | Unresolved. Static Roboto renders 700. The token file emits no axis tokens, so Roboto Flex also renders 700. For 600, use the opt-in block in section 4. Don't add `"wght"` to `font-variation-settings`. |
| Q2 | **ROND 100 on 3P emphasized headline-medium.** A `Font=Variable` row without an audience tag leaks the first-party roundness value into 3P. | No effect (Roboto Flex has no ROND axis). Not shipped. If your brand face has ROND, use 0. |
| Q3 | **Variable-set composites store `opsz: 0` on Web.** The discrete `.opsz` token is undefined there. Taken literally, 0 would clamp to 8, the small-text design at every size. | Ignore it and use `font-optical-sizing: auto`. |
| Q4 | **Sys line heights don't reference the language-height tokens.** Every `md.sys.typescale.*.line-height` is a literal Small value. | The token file's switch rewrites the ref, baseline and emphasized line heights together. Do the same in any custom override. |
| Q5 | **Default language height.** The DSDB default is Small, and material-web, Compose and MDC ship only Small. The guidance recommends defaulting to Medium and switching by detected language. | This skill's reading: Small for Latin (except Vietnamese), Greek, Cyrillic and Hebrew content; for any other known language, its script's category, including languages the automatic list misses (the helper in section 5 works it out); Medium only when the language is unknown; for mixed scripts, the tallest script's category. |
| Q6 | **Site viewers show first-party values** (Google Sans, tracking 0). | Take values from the token file, never from the site's viewers. |
| Q7 | **Tracking unit on the type-scale page.** Its web formula divides tracking by font size (an em ratio) but labels the result rem. | The token file uses px ÷ 16 in rem, the material-web encoding. If you change a role's size, convert tracking to em (tracking ÷ size) so the ratio holds. |
| Q8 | **material-web drops tracking.** Its classes use the `font` shorthand and set no letter-spacing. Compose's older token file differs from the DSDB in five tracking values. | Follow the DSDB, as the token file does: set `letter-spacing` from the tracking tokens. |
| Q9 | **`label-large-fill` naming.** The DSDB's label-large fill token uses a hyphen where every other token uses a dot. | Irrelevant on the web: FILL is 0 and Roboto has no FILL axis. |
| Q10 | **Roboto Flex status.** The site calls it outside the official scale, while the DSDB (38.2.9, described as updating variable-font guidance and moving emphasized guidance) models it fully. The rendered pages don't yet reflect that description. | Static Roboto by default; Roboto Flex as an explicit opt-in. Cite guidance by content, not by page location, because it may move. |
| Q11 | **Width range.** The editorial page says 25 to 150; the font and Google Fonts say 25–151. | Request `25..151`. |

## Do and don't

- **Do** pick roles by purpose (a paragraph is body, a small button's label is label-large). **Don't**
  pick a role because its size happens to look right, because the next retune will break the
  meaning.
- **Do** set all five longhands per role. **Don't** use the `font` shorthand after axis or numeral
  settings: it resets them and can't carry tracking anyway.
- **Do** keep tokens in rem and the root size at the default. **Don't** set a px root or 62.5%,
  because users who enlarge text get nothing and every token's px mapping breaks.
- **Do** keep emphasized styles for selection, unread items, primary actions and headlines.
  **Don't** make them the default body or label style, because hierarchy needs a quieter baseline to
  rise from.
- **Do** load 400, 500 and 700 (or a variable range). **Don't** leave a weight missing: the browser
  either smears a fake bold or, with `font-synthesis-weight: none`, falls back to a lighter real
  weight that can match the baseline twin.
- **Do** self-host or embed Roboto on offline and single-file pages. **Don't** count on the
  fallback stack there: the generic face often lacks a 500 (Arial does), so emphasized styles look
  the same as their baseline twins.
- **Do** cap body text at `max-inline-size: 50ch` in Roboto body-large. **Don't** assume `60ch`
  means 60 characters: it measured 63–70.
- **Do** reserve width or use grade when a label changes weight on selection. **Don't** let a tab
  row jump sideways when the selection changes.
- **Do** use `font-optical-sizing: auto` with Roboto Flex. **Don't** hard-code `opsz`, because it
  stops tracking the size when users zoom or enlarge text.
- **Do** set `lang` and the language height, and let containers grow. **Don't** give text
  fixed-height boxes, which clip Medium and Large scripts first.
- **Do** keep expressive faces and custom axes to display, headline and one or two editorial
  moments. **Don't** use them on body, labels or purely informational text, where legibility wins.
- **Do** swap typefaces through `--md-ref-typeface-brand` / `-plain` on `:root`. **Don't** override
  those on a subtree and expect roles to change: the sys tokens were resolved on `:root`.
- **Do** keep case as written. **Don't** add `text-transform: uppercase` to a role: no M3 style is
  all caps (the only case token sets `none`), and forced caps change what translators and users
  wrote.

## Auditing

The consolidated list lives in `references/audit-checklist.md`. Typography checks:

1. **On the scale?** Every text element's computed size, line height, weight and letter spacing
   matches one of the 30 styles for the active language height, or a documented editorial token.
   Sizes come only from 57, 45, 36, 32, 28, 24, 22, 16, 14, 12 and 11px. Treat
   `letter-spacing: normal` as 0.
2. **Scalable?** `font-size` and `line-height` are rem or em, the root font size is not set in px
   or 62.5%, and at 200% text size nothing clips or overlaps.
3. **Right role?** Paragraphs are body, component text is label, small buttons use label-large or
   its emphasized twin (larger Expressive buttons may use a title or headline role, never body),
   and display appears only on short text or numerals.
4. **Emphasis rationed?** Emphasized styles appear only on selected or active items, unread items,
   primary actions, headlines or editorial moments. Each differs from its baseline twin only in
   weight (400→500 or 500→700).
5. **Real weights?** Every weight in use is backed by a loaded face (`document.fonts`, the DevTools
   Rendered Fonts panel), so no synthetic bold appears and 400 and 500 render from different
   faces. Offline and single-file pages embed their fonts.
6. **Axes sane?** No `wght`, `wdth`, `slnt` or `opsz` inside `font-variation-settings`.
   `font-optical-sizing` is `auto`, and the Roboto Flex request includes every axis the CSS uses.
7. **Language height applied?** `<html lang>` is set, and a Medium or Large language shows the taller
   line heights (for example `lang="ja"` gives body-medium 23px; `my` gives 26px).
8. **Stable on state change?** Toggling selection on tabs, chips or list items doesn't move
   neighboring elements.
9. **Readable measure?** Body text runs 40–60 characters per line at every breakpoint (in Roboto
   body-large, prose is capped at `max-inline-size: 50ch`), and table, timer and counter figures
   are tabular.
10. **Restraint?** At most one or two editorial moments, none on labels, and no `text-transform:
    uppercase` on roles.

## Sources

- Material 3, Typography overview: https://m3.material.io/styles/typography/overview
- Material 3, Fonts: https://m3.material.io/styles/typography/fonts
- Material 3, Type scale & tokens: https://m3.material.io/styles/typography/type-scale-tokens
- Material 3, Applying type: https://m3.material.io/styles/typography/applying-type
- Material 3, Editorial treatments: https://m3.material.io/styles/typography/editorial-treatments
- Material 3, Applying icons (symbols next to text, grade): https://m3.material.io/styles/icons/applying-icons
- Material 3, Breakpoints (line length): https://m3.material.io/foundations/layout/breakpoints/overview
- Material 3, Density: https://m3.material.io/foundations/layout/grids-spacing/density
- Material 3, Color contrast: https://m3.material.io/foundations/designing/color-contrast
- Material 3 blog, Roboto Flex: https://m3.material.io/blog/roboto-flex
- Material 3 blog, Reduce reflow with web fonts: https://m3.material.io/blog/reduce-reflow-with-web-fonts
- Material 3 blog, Building with M3 Expressive: https://m3.material.io/blog/building-with-m3-expressive
- Material 3, Components (exact per-component type styles): https://m3.material.io/components
- Compose Material 3 `Button.kt` (label style by button height): https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt
- material-web typography theming: https://github.com/material-components/material-web/blob/main/docs/theming/typography.md
- Google Fonts CSS API v2: https://developers.google.com/fonts/docs/css2
- Roboto Flex on Google Fonts: https://fonts.google.com/specimen/Roboto+Flex
- MDN `font-variation-settings`: https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
- MDN `font-optical-sizing`: https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
- MDN `font` shorthand: https://developer.mozilla.org/en-US/docs/Web/CSS/font
- MDN `font-synthesis`: https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis
- MDN `@font-face`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
- WCAG 2.2, Resize text (1.4.4): https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- WCAG 2.2, Text spacing (1.4.12): https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- WCAG 2.2, Contrast minimum (1.4.3): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2, Failure F94 (viewport-only text size): https://www.w3.org/WAI/WCAG22/Techniques/failures/F94
