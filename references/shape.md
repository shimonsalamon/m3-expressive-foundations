# Shape

Shape sets the corners of every container and supplies the decorative forms that crop images or mark a
moment. In M3 Expressive the corner scale grew from seven to ten steps (20, 32 and 48px were added), "full"
became its own value instead of "50%", and a library of 35 abstract shapes arrived that can morph into one
another. Single-corner `corner-value` tokens, which express asymmetric "inner corners", appeared at the same
time (probably part of the update). Use the corner scale for every rectangular surface. Keep library shapes
for imagery, decoration and the occasional focal element.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [Principles: using shape expressively](#principles-using-shape-expressively)
- [Corner radius scale](#corner-radius-scale): the ten styles, asymmetric presets, corner-value tokens,
  choosing a step, "full", inner corners, state through shape, pressed and selected shapes by size (buttons, button
  groups), customizing
- [Optical roundness (nested radii)](#optical-roundness-nested-radii)
- [The shape library (35 shapes)](#the-shape-library-35-shapes)
- [Shape morphing](#shape-morphing)
- [Applying it on the web](#applying-it-on-the-web): corners and nested radii, full, logical corners and RTL
  (connected rows, grouped lists), cut corners and `corner-shape`, library shapes, morphing (CSS, WAAPI, JS
  spring, community ports), clipping caveats and drop-shadow helpers, browser support
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **Shape is a hierarchy tool.** It pulls the eye, tells people what is interactive or selected, and carries
  brand personality. The contrast between shapes (round against square, plain against abstract) does the
  work, so a single consistent default plus a few deliberate exceptions is more effective than variety everywhere.
- **All rectangular corners come from one 10-step scale** named by how rounded the corner is (none to full),
  not by component size. Each component is mapped to a step, so resizing one step re-tunes every component
  that uses it. That is how a product changes its shape personality without touching components.
- **Size and density pick the step** (the pattern in Material's component defaults). Small, dense or
  text-entry elements get small radii; large containers get larger ones; compact tappable controls are fully
  rounded. Material cautions against large or full corners on information-dense components, because big
  curves eat the space near the corners where content would sit.
- **Nested corners must be optical, not equal.** Inner radius = outer radius − padding. Reusing the parent's
  radius on a child makes the gap between them look uneven.
- **Library shapes are accents without fixed meaning.** Use them to crop images and avatars, hold a single
  metric, or celebrate a moment. Don't make a shape stand for one thing (a wave is not "loading"), and don't
  let a shape change be the only sign of a state.
- **Morphing is spatial motion with a job.** Animate between shapes to show a state change, progress or a
  change in the environment, with a spatial spring. Turn decorative morphs off under reduced motion.
- **On the web, corners are `border-radius` with tokens; library shapes are `clip-path`.** Material ships no
  web implementation of the library or morph, so the shipped assets are an unofficial port, and clipping
  hides focus rings and shadows and shrinks the hit area unless you design around it.

## What M3 Expressive changed

Everything below dates from the May 2025 Expressive update unless noted.

| Change | Status | Detail |
|---|---|---|
| Three corner steps added: large-increased 20px, extra-large-increased 32px, extra-extra-large 48px | New | The scale went from 7 styles to 10. The token database added them on 2024-08-08, ahead of the public launch. |
| "Full" redefined | Changed | Previously described as 50% of the component size; now a distinct fully-rounded value (radius = half the shorter side). On the web it is encoded as `9999px`. |
| `corner-value.*` single-corner tokens | Probably new | Nine per-corner lengths (none to extra-extra-large), created alongside the new steps and absent from 2023 Material Web tokens. Material now distinguishes tokens for all corners from tokens for one corner. |
| Asymmetric "inner corners" for grouped items | Probably newly documented | Split buttons and connected button groups (new Expressive components) round their touching corners less than their outer corners. The pre-Expressive page had no section on symmetry. |
| Shape library: 35 shapes with built-in morphing | New | Figma kit, Jetpack Compose (`MaterialShapes`) and Android Views. Material states it is not available for web. |
| New shape principles | New | Shape and type harmony, morph with purpose, embrace tension, versatile not semantic, abstract shapes sparingly, aesthetic moments, 2.5D. Material's home page lists "contrasting shapes" among the headline Expressive additions. |
| Shape morph motion | New | Uses the expressive motion scheme by default; the standard scheme can be swapped in. |
| Values of the original steps | Unchanged | none 0, extra-small 4, small 8, medium 12, large 16, extra-large 28, plus the five asymmetric presets. |
| Customizing (style change vs component change), cut corners | Likely unchanged | A customization section existed before Expressive, and Compose and MDC-Android have supported cut corners since M3 launched. |
| Optical roundness (nested radii) | Unknown | The current page documents it; the pre-Expressive text could not be retrieved to compare. |
| Material Web | Maintenance mode | Material Web does not implement Expressive. The shipped CSS in this skill supplies the Expressive tokens and web helpers, but no components. |

## Principles: using shape expressively

| Principle | What to do | Why |
|---|---|---|
| Emphasis through contrast | Give the one element that matters a shape that breaks the surrounding pattern: a fully rounded hero button among 12px cards, a square selected item in a row of pills, a flower-cropped photo in a grid of rectangles. | The eye goes to the odd one out. If everything is unusual, nothing stands out. |
| Tension: round against sharp | Mix square and round on purpose. Material used to default to round everywhere; Expressive wants some sharp or square corners in the mix. | Sharp forms make a layout more dynamic and memorable, and the contrast can mark state or focus. |
| Don't shrink what matters | Essential actions get a shape at least as prominent as secondary ones. | A smaller or weaker shape reads as a less important action. |
| State | A change of shape can show selection, press or progress (round buttons square up when pressed, a toggle swaps round and square when selected). Pair it with color, icon or label (this skill's rule; Material's toggles do change color too). | Shape alone is easy to miss and carries no meaning for assistive tech. |
| Brand | Set the shape personality globally: resize scale steps (rounder or squarer), switch to cut corners, and match the icon style (Rounded icons with round corners, Sharp icons with square or cut corners). | One global decision keeps the product coherent; per-component tweaks drift. |
| Harmony with type | Choose corner roundness that matches the letterforms. Material points out that its shapes share their roundness with Google Sans Flex. | Shape and type seen together should feel like one voice. With a sharper or more geometric typeface, lean toward squarer steps (a judgment call; Material gives no numbers). |
| Restraint with abstract shapes | Use library shapes only where you can say what each one adds, how it balances the composition and how it fits the product story. When repeating a shape, keep form and size uniform, space them out and don't overlap them. | Shapes that differ without a reason add clutter, not delight. |
| Versatile, not semantic | Don't turn a shape into a symbol. A wavy progress indicator does not make waves mean "loading"; progress could equally rotate or morph a shape, and a wave can decorate a button. | Fixed meanings box the design system in and confuse users when the shape appears elsewhere. |
| Decorative freedom | Be most adventurous on non-interactive visuals: photo crops, avatar masks, illustrations, empty-state art. | Decoration carries no usability risk, so it is where expressiveness is cheapest. |
| Depth (2.5D) | Move layers differently (shape change on one, position on another) to suggest volume. | Depth adds richness without extra chrome. |

Order of work: build hierarchy first with color, size, spacing, placement and containment, then add shape
emphasis and morphs. Keep to one or two hero moments per product and don't stack many expressive tactics
on one screen.

## Corner radius scale

### The ten styles

Values are identical in every theme, contrast level and motion scheme. 1dp = 1px.

| Step | Token | CSS custom property | Value | Suits (by size and density) |
|---|---|---|---|---|
| None | md.sys.shape.corner.none | `--md-sys-shape-corner-none` | `0px` | Surfaces attached to a screen edge or running full-bleed (bars, full-screen views) |
| Extra small | md.sys.shape.corner.extra-small | `--md-sys-shape-corner-extra-small` | `4px` | Small or dense elements: menus, text fields, tooltips, snackbars |
| Small | md.sys.shape.corner.small | `--md-sys-shape-corner-small` | `8px` | Compact elements that are not fully round, such as chips; the pressed form of small round controls |
| Medium | md.sys.shape.corner.medium | `--md-sys-shape-corner-medium` | `12px` | Standard containers such as cards; the selected or pressed form of larger round controls |
| Large | md.sys.shape.corner.large | `--md-sys-shape-corner-large` | `16px` | Larger containers, floating actions, highlighted list items |
| Large increased (new) | md.sys.shape.corner.large-increased | `--md-sys-shape-corner-large-increased` | `20px` | A step between large and extra-large for containers that outgrow 16px |
| Extra large | md.sys.shape.corner.extra-large | `--md-sys-shape-corner-extra-large` | `28px` | Large surfaces: dialogs, sheets, pickers |
| Extra large increased (new) | md.sys.shape.corner.extra-large-increased | `--md-sys-shape-corner-extra-large-increased` | `32px` | No standard component maps to it. This skill suggests it for hero surfaces and custom components. |
| Extra extra large (new) | md.sys.shape.corner.extra-extra-large | `--md-sys-shape-corner-extra-extra-large` | `48px` | No standard component maps to it. This skill suggests it for very large hero containers and media. |
| Full | md.sys.shape.corner.full | `--md-sys-shape-corner-full` | `9999px` (the database stores "circular", no size) | Compact controls people tap; the token's own description lists badge, buttons, icon buttons, sliders, switches and search bar |

The last column states the size-and-density rule, not a component spec. Which step each component uses
changes between releases, so take exact per-component values from Material's component pages
(https://m3.material.io/components).

### Asymmetric presets

Values are in `border-radius` shorthand order: top-left, top-right, bottom-right, bottom-left.

| Token | CSS custom property | Value | Use |
|---|---|---|---|
| md.sys.shape.corner.extra-small.top | `--md-sys-shape-corner-extra-small-top` | `4px 4px 0px 0px` | Filled text field |
| md.sys.shape.corner.large.top | `--md-sys-shape-corner-large-top` | `16px 16px 0px 0px` | Bottom navigation drawer |
| md.sys.shape.corner.large.start | `--md-sys-shape-corner-large-start` | `16px 0px 0px 16px` (LTR); `0px 16px 16px 0px` under `[dir="rtl"]` | No default component; for example a side panel attached to the end edge |
| md.sys.shape.corner.large.end | `--md-sys-shape-corner-large-end` | `0px 16px 16px 0px` (LTR); `16px 0px 0px 16px` under `[dir="rtl"]` | Navigation drawer (attached to the start edge) |
| md.sys.shape.corner.extra-large.top | `--md-sys-shape-corner-extra-large-top` | `28px 28px 0px 0px` | Bottom sheet |

"Top" is the block-start edge, so the top presets need no mirroring. The start/end presets are mirrored by
`[dir]` attribute rules in the shipped file (see [Logical corners and RTL](#logical-corners-and-rtl) for
the limits of that).

### Corner-value tokens (one corner)

| Token | CSS custom property | Value | Use |
|---|---|---|---|
| md.sys.shape.corner-value.none | `--md-sys-shape-corner-value-none` | `0px` | A square corner inside an otherwise rounded shape |
| md.sys.shape.corner-value.extra-small | `--md-sys-shape-corner-value-extra-small` | `4px` | Inner corners of grouped list items and segments (this skill's default; see [Inner corners](#inner-corners-asymmetric-shapes)) |
| md.sys.shape.corner-value.small | `--md-sys-shape-corner-value-small` | `8px` | Inner corners of joined controls at rest; the next step up when a 4px inner corner reacts to state |
| md.sys.shape.corner-value.medium | `--md-sys-shape-corner-value-medium` | `12px` | Inner corners of larger joined controls, or an inner corner rounding up on press or selection |
| md.sys.shape.corner-value.large | `--md-sys-shape-corner-value-large` | `16px` | Per-corner large, for example the outer corners of a grouped list |
| md.sys.shape.corner-value.large-increased | `--md-sys-shape-corner-value-large-increased` | `20px` | Per-corner large increased |
| md.sys.shape.corner-value.extra-large | `--md-sys-shape-corner-value-extra-large` | `28px` | Per-corner extra large |
| md.sys.shape.corner-value.extra-large-increased | `--md-sys-shape-corner-value-extra-large-increased` | `32px` | Per-corner extra large increased |
| md.sys.shape.corner-value.extra-extra-large | `--md-sys-shape-corner-value-extra-extra-large` | `48px` | Per-corner extra extra large |

There is no `corner-value.full`. A fully rounded single corner is half the shorter side (usually the
height), written in px on the web and as 50% of the shorter side in Compose. In total there are 24 shape
tokens: 10 symmetric styles, 5 asymmetric presets and 9 corner values.

In the token database the `corner.*` tokens do not reference `corner-value.*`, and the shipped CSS keeps
every shape token as a literal length. Changing `--md-sys-shape-corner-value-large` therefore does not change
`--md-sys-shape-corner-large` or the large presets; override each token you mean to change.

### Choosing a step

Material gives no decision procedure. The order below is this skill's synthesis of the Compose defaults and
Material's cautions; take the first question that fits.

1. **Is it a compact control people tap or click** (button, icon button, switch track, slider handle,
   search bar)? Use **full**: Material's Aura example notes the rounded form marks a button as a touchable
   control. Badges are full too. Chips are the exception: they use **small** (8px).
2. **Is it attached to a screen edge or full-bleed** (app bar, navigation bar, full-screen sheet in compact
   windows)? Use **none**, or a top/start/end preset so only the free edge is rounded.
3. **Is it small or information-dense** (menu, text field, tooltip, snackbar, data table, text-heavy list)?
   Use **extra-small** or **small**. Dense content next to big curves wastes space and gets clipped.
4. **Is it a standard container** (card, list item in a highlighted state, FAB)? Use **medium** or **large**.
5. **Is it a large surface** (dialog, sheet, picker, large FAB, hero card)? Use **extra-large** (28px),
   stepping up to **extra-large-increased** (32px) or **extra-extra-large** (48px) only for expressive hero
   surfaces with room around the content.
6. **Want contrast?** Break the pattern for one focal element: jump from 12px neighbors to full, or from
   pills to a square.

Keep every instance of a component on the same step unless a variant or state differs on purpose.

### "Full"

Full means a radius of half the **shorter** side: a stadium (pill) on a rectangle and a circle on a square.
Material stores it as a shape family rather than a length. The web encoding `9999px` works only when all
four corners are 9999px, because CSS then scales every radius down by the same factor to fit. Three traps
(measured in Chromium on a 200×56px box):

- `border-radius: 50%` is **not** full. CSS percentages are per axis, so it produces 100px × 28px elliptical
  ends. Use `50%` only on squares (circles).
- **Mixing** 9999px with small radii flattens the small ones. `9999px 4px 4px 9999px` renders the 4px
  corners square, because the fit factor (56 / 19998) applies to all eight radii. `calc(infinity * 1px)`
  does the same. Use half the height instead (`28px` on a 56px element).
- **Animating** from or to 9999px breaks. With linear easing nothing visible happens until about 99.8% of
  the run. With the expressive fast spatial curve the overshoot drives the radius below zero, so the corners
  go square from roughly 30% to 70% of the run, then back to a pill, then to the target. Animate between
  concrete lengths (half the height ↔ target).

### Inner corners (asymmetric shapes)

When items sit edge to edge in a group (split button, connected button group, segmented list or menu), the
group keeps its outer shape and the corners where items meet use a smaller single-corner value. The rule:

- **Inner corners sit one or more steps below the outer corners**, so the group reads as one shape while
  each item stays distinct.
- **Take them from the `corner-value` tokens** (one corner each), which is how Material's component tokens
  express them. A few components use a whole-shape token or a percentage instead, so treat this as the
  normal case, not an absolute rule.
- **Inner corners may move along the scale on interaction**, in either direction (see
  [State through shape](#state-through-shape)); the outer corners stay put.

Illustrative (component value): a connected button group rounds its inner corners to 8px (small) at rest,
tightens them to 4px while an item is pressed and makes a selected item fully round. Split buttons and other
joined components publish their own per-size values; take those from Material's component pages
(https://m3.material.io/components) instead of copying a table.

**Grouped lists and segmented groups: this skill's default.** Material publishes no outer-corner,
inner-corner or gap values for a grouped (segmented) list, a segmented menu, or a custom joined group. Use
these unless the product already has its own:

| Part | Skill default | Why |
|---|---|---|
| Outer corners (first item's block-start corners, last item's block-end corners) | From the nesting rule: the enclosing region's radius minus its padding ([Optical roundness](#optical-roundness-nested-radii)). With no rounded region around the group, choose by size as for any container; large (16px) suits a list group. | The group stays concentric with the region around it. |
| Inner corners | extra-small, 4px (`--md-sys-shape-corner-value-extra-small`) | The smallest rounded step, so it sits below the outer corners and the items read as one shape. |
| Gap between items | 2px (`--md-sys-measurement-space25`) | Enough for the items' surface to separate them. Rows or segments that tile the group count as adjacent targets, so the 8px spacing between targets doesn't apply; each still needs `--m3e-min-target-size` (48px) ([interaction-states.md](interaction-states.md#touch-targets)). |
| A group of one item | Outer corners on all four sides | It is both first and last. |
| Pressed or selected item (optional) | Inner corners move up the scale, as far as the outer value, on `--m3e-motion-spring-fast-spatial`; outer corners stay fixed | Follows [State through shape](#state-through-shape), and another cue (color, check mark) must carry the state too. |

Code: the grouped list and the connected button row in [Logical corners and RTL](#logical-corners-and-rtl).
Surface roles for the groups come from [color.md](color.md).

Strongly asymmetric shapes can make centered content look off-center. Compose can nudge content by
0.11 × (average start radius − average end radius), but that shift is off by default. On the web, adjust
inline padding by eye if needed.

### State through shape

Material states no rule for which way a shape moves on interaction. Compose's component tokens show a
pattern (our reading, not Material's words): **a state change moves the shape visibly along the scale; round
shapes get squarer and near-square shapes get rounder.** Inner corners go either way.

| Starts as | Interaction | Moves to |
|---|---|---|
| Full (round control) | Pressed | Squarer: a few steps down the scale, for a moment |
| Extra small or small (list item, grouped item) | Pressed, selected, focused, dragged | Rounder: a few steps up |
| Round toggle | Selected | Squarer, and it stays there while selected |
| Square toggle | Selected | Full |
| Inner corners of a joined group | Hovered, pressed or selected | Either direction, depending on the component; a selected item may go fully round |

Illustrative (component value): a 40px round button squares from 20px to 8px (small) while pressed. Per-size
values for buttons, toggles and joined groups live on Material's component pages
(https://m3.material.io/components); the next section lists the buttons' and button groups'.

Drive press, toggle and selection morphs on small and medium controls with
`--m3e-motion-spring-fast-spatial`, this skill's default (see [Shape morphing](#shape-morphing)).

### Pressed and selected shapes by size

Material's button tokens (`md.comp.button.<size>.*`, read from the token database with
`scripts/fetch-m3-spec.mjs components/buttons --tokens`, content build 2026-09-23) give the round button's shape per
size. Icon buttons follow the same steps.

| Size (height) | At rest (round) | Pressed | Selected (round toggle) |
|---|---|---|---|
| Extra small (32px) | full | small (8px) | medium (12px) |
| Small (40px, the default) | full | small (8px) | medium (12px) |
| Medium (56px) | full | medium (12px) | large (16px) |
| Large (96px) | full | large (16px) | extra large (28px) |
| Extra large (136px) | full | large (16px) | extra large (28px) |

**One rule for every round button.** Products size buttons between these steps (a 48px icon button, a 64px call
button), so a site-wide rule works better from the height than from a size class. Our interpolation, through
Material's points at 40 and 56px: `clamp(8px, height / 4 - 2px, 16px)`.

```css
.round-button {
  --height: 40px;                              /* the component's real height, ideally its own size token */
  --shape: calc(var(--height) / 2);            /* full, as a real length so it can animate */
  border-radius: var(--shape);
  transition: border-radius var(--m3e-motion-spring-fast-spatial);
}
.round-button.icon-only { --shape: 50%; }      /* square box: 50% is round at any size and animates smoothly */
.round-button:active:not(:disabled) {
  --shape: clamp(8px, var(--height) / 4 - 2px, 16px);
}
.round-button:focus-visible::after {           /* a ring drawn as its own layer, 5px out (3px ring, 2px gap) */
  border-radius: calc(var(--shape) + 5px);
}
```

Apply it to every round button at once, in the shared stylesheet, and exclude what has its own behavior: FABs (the
pressed-shape tokens are the button family's; a FAB keeps its corners), joined groups (their inner corners move
instead, below), and any element that sets its own corners or a press scale. Every layer drawn inside the button (state
layer, ripple container, focus ring) has to take the same corners, or the press shows a rounded layer inside a
squarer button. For Angular Material's buttons, see
[angular-material.md: Shape](angular-material.md#shape-the-press-morph-on-materials-buttons).

**Button groups** (`md.comp.button-group.*`):

- **Standard group:** a pressed button widens by 15% (`pressed.item.width.multiplier`, every size) on the fast
  spatial spring, and its neighbors move aside and narrow for a moment. How much they narrow isn't a token; shrinking
  each neighbor by half the growth (×0.925) keeps the row's length (our choice). In a grid of buttons, only neighbors
  in the same row react.
- **Connected group:** the inner corners change instead of the widths. Pressed: extra small (4px) for extra small,
  small and medium groups, medium (12px) for large, large (16px) for extra large. Selected: 50%, so a selected segment
  goes fully round. Neighbors don't move.

### Customizing

Products should stay on the Material steps by default. Customizing is fine for hero moments and custom
components, at two levels:

- **Style change**: resize a step. Every component mapped to it follows (changing medium affects cards and
  small FABs alike). In the shipped CSS, override the corner token, its corner-value twin and any preset
  built on that step.
- **Component change**: map one component to a different step everywhere (buttons from full to medium for a
  squarer brand). Route each component's radius through its own custom property so this is a one-line change.
- **Cut corners**: the corner family can switch from rounded to cut (a straight diagonal of the same size).
  A cut removes more area than a curve of the same size, so add padding in dense components. See
  [Cut corners and `corner-shape`](#cut-corners-and-corner-shape).

One caution and one permission. Don't put large or full corners on information-dense containers: Material's
counter-example is a text-heavy card with full corners. On the other hand, making shapes rounder on purpose
for variety is fine, and Material endorses alternating square and fully rounded items in a carousel.

## Optical roundness (nested radii)

When a rounded element sits inside another with padding, give the inner one a smaller radius:

**inner radius = outer radius − padding** (never below 0)

Equal radii make the band between the two curves thicker at the corners than along the edges. Material's
example is 48 − 14 = 34px. The other rows are our arithmetic, chosen because they land on the scale:

| Outer | Padding | Inner | Inner step |
|---|---|---|---|
| 28px (extra-large) | 16px | 12px | medium |
| 32px (extra-large-increased) | 12px | 20px | large-increased |
| 48px (extra-extra-large) | 16px | 32px | extra-large-increased |
| 16px (large) | 8px | 8px | small |
| 12px (medium) | 8px | 4px | extra-small |
| 48px (extra-extra-large) | 14px | 34px | off-scale (Material's example) |
| any | ≥ outer radius | 0px | none |

If the result is off-scale, either use the computed value (optics matter more than the scale here) or
change the padding so the result lands on a step. Don't round the inner radius up to the outer one.

The same rule runs outward: a ring drawn outside an element needs radius + gap. Browsers already grow an
outline's radius by `outline-offset` (Chrome 94, Firefox 88, Safari 16.4 and later), so focus rings built
with `outline` stay optically concentric for free.

## The shape library (35 shapes)

The library adds 35 rounded, abstract shapes to the corner scale. Each is a rounded polygon normalized to a
unit square, and any shape can morph into any other. Names below are Material's display names; the id is
what the shipped assets use.

| # | Name | Asset id | Compose constant | Cubic curves | Family |
|---|---|---|---|---|---|
| 1 | Circle | `circle` | `Circle` | 11 | Basic |
| 2 | Square | `square` | `Square` | 9 | Basic (rounded square) |
| 3 | Slanted | `slanted` | `Slanted` | 17 | Basic |
| 4 | Arch | `arch` | `Arch` | 8 | Basic |
| 5 | Fan | `fan` | `Fan` | 11 | Directional |
| 6 | Arrow | `arrow` | `Arrow` | 10 | Directional |
| 7 | Semicircle | `semi-circle` | `SemiCircle` | 8 | Basic |
| 8 | Oval | `oval` | `Oval` | 9 | Basic (tilted −45°) |
| 9 | Pill | `pill` | `Pill` | 13 | Basic |
| 10 | Triangle | `triangle` | `Triangle` | 7 | Directional |
| 11 | Diamond | `diamond` | `Diamond` | 13 | Basic |
| 12 | Clamshell | `clam-shell` | `ClamShell` | 13 | Basic |
| 13 | Pentagon | `pentagon` | `Pentagon` | 11 | Basic |
| 14 | Gem | `gem` | `Gem` | 16 | Basic |
| 15 | Sunny | `sunny` | `Sunny` | 33 | Star |
| 16 | Very sunny | `very-sunny` | `VerySunny` | 33 | Star |
| 17 | 4-sided cookie | `cookie-4-sided` | `Cookie4Sided` | 17 | Scalloped |
| 18 | 6-sided cookie | `cookie-6-sided` | `Cookie6Sided` | 19 | Scalloped |
| 19 | 7-sided cookie | `cookie-7-sided` | `Cookie7Sided` | 15 | Scalloped |
| 20 | 9-sided cookie | `cookie-9-sided` | `Cookie9Sided` | 19 | Scalloped |
| 21 | 12-sided cookie | `cookie-12-sided` | `Cookie12Sided` | 25 | Scalloped |
| 22 | Ghost-ish | `ghostish` | `Ghostish` | 11 | Playful |
| 23 | 4-leaf clover | `clover-4-leaf` | `Clover4Leaf` | 16 | Scalloped |
| 24 | 8-leaf clover | `clover-8-leaf` | `Clover8Leaf` | 24 | Scalloped |
| 25 | Burst | `burst` | `Burst` | 49 | Star |
| 26 | Soft burst | `soft-burst` | `SoftBurst` | 41 | Star |
| 27 | Boom | `boom` | `Boom` | 61 | Star |
| 28 | Soft boom | `soft-boom` | `SoftBoom` | 192 | Star |
| 29 | Flower | `flower` | `Flower` | 56 | Scalloped |
| 30 | Puffy | `puffy` | `Puffy` | 58 | Scalloped |
| 31 | Puffy diamond | `puffy-diamond` | `PuffyDiamond` | 29 | Scalloped |
| 32 | Pixel circle | `pixel-circle` | `PixelCircle` | 30 | Pixel |
| 33 | Pixel triangle | `pixel-triangle` | `PixelTriangle` | 25 | Pixel |
| 34 | Bun | `bun` | `Bun` | 22 | Playful |
| 35 | Heart | `heart` | `Heart` | 12 | Playful |

The family column is this skill's grouping, not Material's. Cubic count is a rough cost: Soft boom produces a
very long `shape()` value, so prefer simpler shapes where many instances render or animate.

### Where library shapes belong

Material's stated uses are decorative detail and morphing for image crops, avatars, loading indicators and
progress, plus masking imagery and filling empty space. Its worked example (the "Aura" breathing app) uses
Flower and Sunny for the breathing guide so it stands apart from plain pause and stop buttons, puts single
metrics inside flower shapes, and marks completed days on a calendar with the same flower.

Because shapes carry no fixed meaning, the table below is guidance, not a mapping:

| Family | Good for | Watch out for |
|---|---|---|
| Basic (circle, square, pill, arch, semicircle, oval) | Avatars, photo crops (arch suits portraits), icon containers | Too plain to count as emphasis on their own |
| Scalloped (cookies, clovers, flower, puffy) | Avatars, achievement badges, a single metric, playful emphasis | Text beyond a number or a word; scallops cut into it |
| Star (sunny, burst, boom) | Celebration, "new" or promo moments; Material's loading indicator uses Soft burst and Sunny | Spiky outlines shrink the usable area; keep them decorative |
| Directional (arrow, triangle, fan) | Decoration with a sense of movement | Can be read as an icon (play, next); avoid where that misleads |
| Pixel (pixel circle, pixel triangle) | Retro or game-flavored brands | Clashes with an otherwise soft system |
| Playful (heart, bun, ghost-ish) | Personality moments, empty states | The heart reads as "favorite"; don't imply a meaning you don't mean |

Rules that come from Material: keep library shapes off text-heavy containers; use a few, uniform in form
and size, with space between them and the data, and no overlaps; when a shape morphs, keep nearby text and
icons still so the morph is the only moving thing.

### The shipped assets

All three files hold the same geometry, exported from Compose's `MaterialShapes` definitions with a community
TypeScript port (shape-morph 0.4.0, cross-checked against material-shapes-ts 0.3.0). They are unofficial,
since Material offers no web version. Each renders identically through CSS `shape()` and SVG clip paths in
Chromium and matches Material's 35-shape figure.

| File | Contents | Use it for |
|---|---|---|
| `assets/material-shapes.json` | `{ about, usage, shapes: [{ id, name, compose, cubics, d }] }`; `d` is SVG path data in a 0..1 box | Inline `<svg viewBox="0 0 1 1">`, canvas `Path2D`, build scripts, generating your own assets |
| `assets/material-shapes.svg` | A hidden sprite of 35 `<clipPath id="m3-shape-<id>" clipPathUnits="objectBoundingBox">` | `clip-path: url(#m3-shape-<id>)` in any browser; inline it once in the page (external-file references are not supported everywhere) |
| `assets/material-shapes.css` | 35 custom properties on `:root`, `--m3e-shape-<id>: shape(...)`, in percentages | Responsive `clip-path: var(--m3e-shape-<id>)` in Chrome 135+, Firefox 148+, Safari 18.4+ |

The `--m3e-shape-*` properties are web helpers, not Material tokens. The CSS file is about 56 KB; copy only
the shapes you use into your stylesheet if size matters. The sprite and the `shape()` values stretch to the
element's box (as Compose does), so give shaped elements `aspect-ratio: 1` unless you want the stretched
look. Inline SVG from the JSON keeps its proportions by default; add `preserveAspectRatio="none"` to stretch it.

## Shape morphing

**What it is.** An animated change from one shape to another: a corner radius changing (round button
squaring up on press) or one library shape becoming another (circle to 9-sided cookie). Compose matches the
corners and edges of the two shapes, then moves each matched curve linearly with the animation progress.

**When to use it.** Only when it communicates something:

- an interaction or state (selected, pressed, released, long-pressed, swiped, scrolled);
- an action in progress (loading, someone typing, a timer);
- a change in the environment (sound level, temperature, time of day).

Material uses it in button groups (press and select) and the loading indicator (progress). How much to use
is our reading: morphs between library shapes are strong accents, so keep them to a few focal places, such as
a loader, a hero avatar or a celebration. Corner morphs on controls (a button squaring up on press) are routine
feedback in Material's own components and can appear throughout a product.

**Which motion.**

- Shape and corner changes are **spatial** motion: use a spatial spring. Morphs follow the product's motion
  scheme, expressive by default (bouncy); the standard scheme is allowed.
- Material names no single token for morphs, and its motion guidance picks spring speed by the size of what
  moves and how far. This skill's default for press, toggle and selection morphs on small and medium
  controls (buttons, icon buttons, chips, list items, avatars up to about 72px) is **fast spatial**
  (expressive: damping 0.6, stiffness 800), the spring Compose uses for toggle and button-group morphs. Use
  **default spatial** for partial-screen surfaces and **slow spatial** for full-screen ones.
- Compose keeps plain (non-toggle) button presses calmer; that alternative and when it is acceptable are
  covered in [interaction-states.md](interaction-states.md#expressing-state-with-shape-and-springs) and
  [motion.md](motion.md).
- Progress morphs (a loader, a timer) cycle through a few library shapes on a spatial spring, usually while
  rotating. Material's loading indicator is built this way; take its shape sequence, timing and size from
  its component page (https://m3.material.io/components/loading-indicator/overview) rather than
  re-deriving them.
- Under reduced motion, turn decorative morphs off (Material lists shape morphing among the effects to
  disable). A functional corner change can switch instantly instead.

Web helpers for these springs (full details in the motion reference):

| Spring | Helper (shorthand) | Expressive value | Standard value (`data-motion-scheme="standard"`) |
|---|---|---|---|
| Fast spatial | `--m3e-motion-spring-fast-spatial` | `350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)` | `350ms cubic-bezier(0.27, 1.06, 0.18, 1)` |
| Default spatial | `--m3e-motion-spring-default-spatial` | `500ms cubic-bezier(0.38, 1.21, 0.22, 1)` | `500ms cubic-bezier(0.27, 1.06, 0.18, 1)` |
| Slow spatial | `--m3e-motion-spring-slow-spatial` | `650ms cubic-bezier(0.39, 1.29, 0.35, 0.98)` | `750ms cubic-bezier(0.27, 1.06, 0.18, 1)` |

Each has `-linear` variants (a `linear()` trace of the real spring, more faithful) and split `-duration` /
`-easing` helpers. Under `prefers-reduced-motion: reduce` the shipped file turns every spatial helper into
`1ms linear`, so CSS transitions built on them become instant automatically. JS-driven morphs must check
`matchMedia` themselves.

## Applying it on the web

Load `assets/m3-expressive-tokens.css` first (and `assets/material-shapes.css` if you use library shapes).
The examples work the same in React, Vue, Svelte or plain HTML.

### Corners with tokens

```css
/* Each component reads its own property and falls back to its Material step. */
.card {
  border-radius: var(--app-card-shape, var(--md-sys-shape-corner-medium));
}
.button {
  block-size: 40px; /* illustrative (component value); give a 40px visual a 48px hit area (interaction-states.md, Touch targets) */
  border-radius: var(--app-button-shape, var(--md-sys-shape-corner-full));
}
.bottom-sheet {
  border-radius: var(--md-sys-shape-corner-extra-large-top);
}

/* Component change: squarer buttons and cards across the product, one line each. */
:root {
  --app-button-shape: var(--md-sys-shape-corner-medium);
  --app-card-shape: var(--md-sys-shape-corner-small);
}

/* Style change: a rounder "medium" everywhere. Tokens are literal, so set both twins.
   Load this after the token file: equal specificity, so the later rule wins. */
:root {
  --md-sys-shape-corner-medium: 16px;
  --md-sys-shape-corner-value-medium: 16px;
}
```

Because the shipped tokens are literal lengths, you can also override them on any subtree (a hero section,
a themed card) and descendants pick up the new value. The exception is a remap declared on `:root` with
`var()`: it resolves on `:root`, so a subtree override of the sys token no longer reaches that component;
override the component property (`--app-card-shape`) in the subtree instead. Always include the unit
(`0px`, not `0`): a unitless zero custom property breaks any `calc()` or `max()` that uses it.

Nested radii follow the optical-roundness rule with `max()`, so the inner corner tracks any change to the
outer radius or the padding:

```css
.hero-card {
  --outer-radius: var(--md-sys-shape-corner-extra-large);  /* 28px */
  --padding: var(--md-sys-measurement-space200);           /* 16px */
  border-radius: var(--outer-radius);
  padding: var(--padding);
}
.hero-card__media {
  border-radius: max(0px, var(--outer-radius) - var(--padding)); /* 12px, the medium step */
}
```

### Full corners that survive mixing and animation

```css
/* Symmetric pill or circle: the token is fine. */
.pill-button {
  border-radius: var(--md-sys-shape-corner-full);
}

/* Mixed or animated: use a concrete half-height. */
.toggle {
  --height: 40px; /* illustrative (component value); give a 40px visual a 48px hit area (interaction-states.md, Touch targets) */
  block-size: var(--height);
  border-radius: calc(var(--height) / 2);
  transition: border-radius var(--m3e-motion-spring-fast-spatial);
}
.toggle[aria-pressed="true"] {
  border-radius: var(--md-sys-shape-corner-medium);
}

/* A true circle on a square box: 50% is correct here and only here. */
.avatar-circle {
  inline-size: 40px;
  aspect-ratio: 1;
  border-radius: 50%;
}
```

If the height depends on content and you need a full side on an asymmetric or animated shape, give the
element a fixed block size (Material controls have fixed heights) or measure it in JS and set `--height`.

### Logical corners and RTL

For start/end shapes and inner corners, use the logical longhands: `border-start-start-radius`,
`border-start-end-radius`, `border-end-start-radius`, `border-end-end-radius`. The first word is the block
side, the second the inline side, so `border-start-start-radius` is top-left in LTR and top-right in RTL.
There is no logical `border-radius` shorthand.

```css
.nav-drawer {
  border-start-start-radius: var(--md-sys-shape-corner-value-none);
  border-end-start-radius: var(--md-sys-shape-corner-value-none);
  border-start-end-radius: var(--md-sys-shape-corner-value-large);
  border-end-end-radius: var(--md-sys-shape-corner-value-large);
}

/* Connected button row: full outer corners, inner corners that react to state.
   The 8px / 4px / full inner values are illustrative (component values). */
.button-row {
  --height: 40px; /* illustrative (component value); give a 40px visual a 48px hit area (interaction-states.md, Touch targets) */
  display: flex;
  gap: var(--md-sys-measurement-space25); /* 2px */
}
.button-row > button {
  --start: var(--md-sys-shape-corner-value-small);
  --end: var(--md-sys-shape-corner-value-small);
  block-size: var(--height);
  border-start-start-radius: var(--start);
  border-end-start-radius: var(--start);
  border-start-end-radius: var(--end);
  border-end-end-radius: var(--end);
  transition: border-radius var(--m3e-motion-spring-fast-spatial);
}
.button-row > button:first-child {
  --start: calc(var(--height) / 2);
}
.button-row > button:last-child {
  --end: calc(var(--height) / 2);
}
.button-row > button:active:not(:first-child) {
  --start: var(--md-sys-shape-corner-value-extra-small);
}
.button-row > button:active:not(:last-child) {
  --end: var(--md-sys-shape-corner-value-extra-small);
}
.button-row > button[aria-pressed="true"] {
  --start: calc(var(--height) / 2);
  --end: calc(var(--height) / 2);
}
```

`transition: border-radius` also animates changes made through the logical longhands (verified in
Chromium).

A grouped (segmented) list with this skill's defaults from [Inner corners](#inner-corners-asymmetric-shapes).
Here the list sits in a region with a 28px radius and 12px padding, so its outer corners are 28 − 12 = 16px.
A one-item list gets outer corners all round, because its only item is both first and last.

```css
.group-list {
  --outer: var(--md-sys-shape-corner-value-large);        /* 16px, from the nesting rule */
  --inner: var(--md-sys-shape-corner-value-extra-small);  /* 4px, skill default */
  display: grid;
  gap: var(--md-sys-measurement-space25);                 /* 2px, skill default */
  margin: 0;
  padding: 0;
  list-style: none;
}
.group-list > li {
  /* Background: the group's surface role (see color.md). */
  border-radius: var(--inner);
}
.group-list > li:first-child {
  border-start-start-radius: var(--outer);
  border-start-end-radius: var(--outer);
}
.group-list > li:last-child {
  border-end-start-radius: var(--outer);
  border-end-end-radius: var(--outer);
}
```

The shorthand presets `--md-sys-shape-corner-large-start` and `-large-end` are mirrored by `[dir="rtl"]` and
`[dir="ltr"]` rules in the shipped file. That covers `dir` attributes only: it does not follow
`direction: rtl` set in CSS or `dir="auto"`. A later `:root` override of those presets also beats the
`[dir="rtl"]` rule on `<html dir="rtl">`. If you resize them, restate both directions, with the RTL rule
last:

```css
:root,
[dir="ltr"] {
  --md-sys-shape-corner-large-start: 20px 0px 0px 20px;
  --md-sys-shape-corner-large-end: 0px 20px 20px 0px;
}
[dir="rtl"] {
  --md-sys-shape-corner-large-start: 0px 20px 20px 0px;
  --md-sys-shape-corner-large-end: 20px 0px 0px 20px;
}
```

The token database stores start/end physically (top-left plus bottom-left for "start"), as Material Web and
MDC-Android do, while Compose treats them as logical and mirrors them. The token names say start and end,
so this skill follows the logical reading.

### Cut corners and `corner-shape`

M3 rounded corners are plain circular arcs, which `border-radius` already draws. CSS `corner-shape` (values
`round`, `scoop`, `bevel`, `notch`, `square`, `squircle`, `superellipse(K)`, plus per-corner and logical
longhands) reshapes the curve inside the radius and also shapes the border, background, outline, shadow and
overflow clip. As of September 2026 it ships in Chrome and Edge 139+ only; Firefox and Safari have it in
preview builds, and it is not Baseline. It animates between keywords.

- Use `corner-shape: bevel` as a progressive enhancement for the M3 **cut** family. Other browsers keep
  round corners, which is an acceptable fallback.
- Don't apply `squircle` or `superellipse()` to the M3 scale by default. Material never specifies
  superellipse corners, so it changes the look of every token.
- If cut corners are essential to the brand in every browser, use `clip-path: polygon()` on a
  non-interactive layer, and see [Clipping caveats](#clipping-caveats).

```css
.cut-card {
  border-radius: var(--md-sys-shape-corner-medium); /* the size of the cut: 12px */
  padding: var(--md-sys-measurement-space200);      /* 16px: clears a cut of up to 32px */
}
@supports (corner-shape: bevel) {
  .cut-card {
    corner-shape: bevel;
  }
}
```

Padding rule (our geometry): content clears a cut when the padding is at least half the cut size. A rounded
corner needs only about 0.3 × its radius, which is why Material asks for extra padding once the family is cut.

`border-shape` (borders that follow any basic shape) is experimental and Chrome 147+ only; don't rely on it.

### Library shapes on the page

Three ways, in order of preference:

1. **CSS `shape()`** from `assets/material-shapes.css`: responsive (percentages), animatable, no DOM needed.
2. **SVG sprite** `assets/material-shapes.svg` with `clip-path: url(#m3-shape-<id>)`: works in every
   current browser; inline the sprite once in the page.
3. **Inline SVG** from `assets/material-shapes.json`: best when the shape is painted artwork rather than a
   mask (a decorative blob, a metric background), because nothing gets clipped.

`clip-path: path("...")` also works but uses pixel coordinates, so it does not scale with the element; prefer
`shape()`. `mask-image` with the SVG as a data URI (`mask-size: 100% 100%`) is another option, with the
same clipping caveats.

```html
<!-- Once per page, e.g. first thing in <body>: the contents of assets/material-shapes.svg -->
<img class="profile" src="me.jpg" alt="Profile photo">

<!-- Painted decoration from material-shapes.json (d = the shape's path data) -->
<div class="metric">
  <svg class="metric__shape" viewBox="0 0 1 1" aria-hidden="true"><path d="M…Z"/></svg>
  <span class="metric__value">12</span>
</div>
```

```css
.profile {
  inline-size: 56px;
  aspect-ratio: 1;
  object-fit: cover;
  clip-path: url(#m3-shape-cookie-9-sided); /* sprite: fallback for every browser */
}
@supports (clip-path: shape(from 0% 0%, line to 100% 100%, close)) {
  .profile {
    clip-path: var(--m3e-shape-cookie-9-sided); /* needs material-shapes.css loaded */
  }
}

.metric {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: 96px;
  aspect-ratio: 1;
}
.metric__shape {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  fill: var(--md-sys-color-tertiary-container);
}
.metric__value {
  position: relative;
  color: var(--md-sys-color-on-tertiary-container);
}
```

For an outlined library shape, draw it as inline SVG with a stroke (`vector-effect: non-scaling-stroke`
keeps the stroke width in px inside the 0..1 viewBox). A CSS `border` on a clipped element is cut away.

### Morphing on the web

**Corner morphs** are plain `border-radius` transitions between concrete lengths (examples above). This is
what Compose does too: it interpolates each corner size. Keep both ends concrete (never 9999px).

**Library-shape morphs** need two paths with the same structure. CSS interpolates `shape()` and `path()`
only when both have the same number and sequence of commands (same `to`/`by` keywords and control-point
counts); otherwise the change snaps at 50%. Most pairs of shipped values have different curve counts, so a
transition between them snaps. The few pairs with equal counts (Circle, Fan, Pentagon and Ghost-ish all have
11) do interpolate, but their points pair up arbitrarily, so the shape twists instead of morphing.

The fix is to build a matched pair once, at build time, with a port of Compose's `Morph`. `Morph` moves
matched curves linearly, so CSS interpolation between the pair gives the same in-between shapes as the
port's `Morph` at every progress value. In Chromium the transition's midpoint matched `Morph.asCubics(0.5)`
to within the 2-decimal rounding of the percentages. The port was not compared against Compose's own output.

```js
// build-morph.mjs  (npm i shape-morph)   node build-morph.mjs Circle Cookie9Sided > morph.css
import { Morph, getShape } from 'shape-morph';

const pct = (n) => `${+(n * 100).toFixed(2)}%`;
export function cubicsToShape(cubics) {
  const c0 = cubics[0];
  let s = `shape(from ${pct(c0.anchor0X)} ${pct(c0.anchor0Y)}`;
  for (const c of cubics) {
    s += `, curve to ${pct(c.anchor1X)} ${pct(c.anchor1Y)}` +
         ` with ${pct(c.control0X)} ${pct(c.control0Y)} / ${pct(c.control1X)} ${pct(c.control1Y)}`;
  }
  return `${s}, close)`;
}

const [a, b] = process.argv.slice(2); // Compose names: Circle, Cookie9Sided, SoftBurst, ...
const morph = new Morph(getShape(a), getShape(b));
console.log(`.morph-${a}-${b} {
  --shape-from: ${cubicsToShape(morph.asCubics(0))};
  --shape-to: ${cubicsToShape(morph.asCubics(1))};
}`);
```

Then transition between them with a spatial spring. The avatar below is a 72px control, so it uses fast
spatial, the same speed in all three drivers that follow. An overshooting curve pushes the shape a little
past its target, which is the intended bounce. Let an unclipped parent own the state and the pointer
events: hit-testing follows the clip, so a `:hover` rule or pointer handler on the clipped element itself
flickers as the moving edge crosses the pointer. The morph shows the toggle's pressed state and
`aria-pressed` exposes it to assistive tech. In a real product, add a visible second cue as well, such as a
filled favorite badge, because shape alone is easy to miss.

```html
<!-- The button's name says what the toggle does; the photo is decorative inside it. -->
<button class="avatar-toggle" type="button" aria-pressed="false" aria-label="Favorite Alex">
  <img class="morph-avatar morph-Circle-Cookie9Sided" src="alex.jpg" alt="">
</button>
```

```css
/* Zero-specificity placeholders: the generated .morph-Circle-Cookie9Sided rule always wins,
   whatever the load order. */
:where(.morph-avatar) {
  --shape-from: none;
  --shape-to: none;
}
.avatar-toggle {
  padding: 0;
  border: 0;
  background: none; /* nothing shows through where the photo is clipped away */
  border-radius: var(--md-sys-shape-corner-full); /* the focus ring follows this */
}
.morph-avatar {
  display: block;
  inline-size: 72px;
  aspect-ratio: 1;
  object-fit: cover;
  clip-path: var(--shape-from);
  transition: clip-path var(--m3e-motion-spring-fast-spatial); /* 72px control: fast spatial */
}
.avatar-toggle[aria-pressed="true"] > .morph-avatar {
  clip-path: var(--shape-to);
}
@media (prefers-reduced-motion: reduce) {
  .morph-avatar {
    transition: none; /* the spatial helper is already 1ms here; this states the intent */
  }
}
```

```js
// Flip the state; the CSS transition morphs the photo.
const toggle = document.querySelector('.avatar-toggle');
toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
});
```

Use one driver per element: the CSS transition above, the WAAPI helper, or the JS spring below, never two.
With the Web Animations API, pass the generated pair and the split helpers of the same fast spatial spring:

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// el's clip-path must already be the pair's other shape() string (not none), or the change snaps.
// to: the target string. Starts from the current value, even mid-animation.
function morphTo(el, to) {
  const cs = getComputedStyle(el);          // also picks up data-motion-scheme on an ancestor
  const from = cs.clipPath;
  el.getAnimations().forEach((a) => a.cancel());
  el.style.transition = 'none';             // this function is the only driver
  el.style.clipPath = to;                   // the end state, and the whole change under reduced motion
  if (reduce.matches) return;
  el.animate([{ clipPath: from }, { clipPath: to }], {
    duration: parseFloat(cs.getPropertyValue('--m3e-motion-spring-fast-spatial-duration')),
    easing: cs.getPropertyValue('--m3e-motion-spring-fast-spatial-easing').trim(),
  });
}

// Usage, instead of the click handler above: flip the state, then morph to that end of the pair.
const avatarToggle = document.querySelector('.avatar-toggle');
const avatar = avatarToggle.querySelector('.morph-avatar');
avatarToggle.addEventListener('click', () => {
  const on = avatarToggle.getAttribute('aria-pressed') !== 'true';
  avatarToggle.setAttribute('aria-pressed', String(on));
  morphTo(avatar, getComputedStyle(avatar).getPropertyValue(on ? '--shape-to' : '--shape-from').trim());
});
```

CSS transitions and this helper restart from the current shape when interrupted, but they lose velocity.
For interruptible morphs that keep momentum (Compose's behavior when a press is released mid-animation),
drive the `Morph` progress with a real spring in JS, fed by the fast spatial damping and stiffness tokens.
The spring below is the exact closed-form solution, so a second click mid-morph reverses it with position
and velocity continuous:

```js
import { Morph, getShape } from 'shape-morph';
// cubicsToShape: as in build-morph.mjs above

function springTo(state, target, { damping: z, stiffness: k }, onFrame) {
  cancelAnimationFrame(state.raf);
  const w0 = Math.sqrt(k);
  const wd = w0 * Math.sqrt(Math.max(1e-6, 1 - z * z)); // z = 1 runs as near-critical
  const A = state.x - target;
  const B = (state.v + z * w0 * A) / wd;
  const t0 = performance.now();
  const step = (now) => {
    const t = Math.max(0, now - t0) / 1000; // a frame timestamp can precede t0
    const e = Math.exp(-z * w0 * t), cos = Math.cos(wd * t), sin = Math.sin(wd * t);
    state.x = target + e * (A * cos + B * sin);
    state.v = e * ((B * wd - z * w0 * A) * cos - (A * wd + z * w0 * B) * sin);
    const done = Math.abs(state.x - target) < 1e-3 && Math.abs(state.v) < 1e-2;
    if (done) { state.x = target; state.v = 0; }
    onFrame(state.x);
    if (!done) state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}

const host = document.querySelector('.avatar-toggle'); // unclipped: it owns the state and the clicks
const el = host.querySelector('.morph-avatar');
el.style.transition = 'none'; // JS drives every frame; a CSS transition would restart on each one
const morph = new Morph(getShape('Circle'), getShape('Cookie9Sided'));
const cs = getComputedStyle(el); // reads the motion scheme in effect for el
const spring = {
  damping: +cs.getPropertyValue('--md-sys-motion-spring-fast-spatial-damping'),
  stiffness: +cs.getPropertyValue('--md-sys-motion-spring-fast-spatial-stiffness'),
};
const state = { x: 0, v: 0, raf: 0 };
const render = (p) => { el.style.clipPath = cubicsToShape(morph.asCubics(p)); };
render(0);
const go = (target) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(state.raf);
    state.x = target;
    state.v = 0;
    render(target);
  } else {
    springTo(state, target, spring, render);
  }
};
// Instead of the click handlers above: flip the state, then spring toward it.
host.addEventListener('click', () => {
  const on = host.getAttribute('aria-pressed') !== 'true';
  host.setAttribute('aria-pressed', String(on));
  go(on ? 1 : 0);
});
```

With the expressive fast spatial values (0.6 / 800) this peaks about 9.5% past the target and is within
0.1% of it after about 0.36s, in step with the 350ms CSS helper used by the other two drivers. `asCubics()` accepts progress outside 0..1, so the overshoot extrapolates the
shape instead of clamping.

Other routes: the SVG `d` property interpolates matched paths in Chrome and Firefox but not Safari (use SMIL
`<animate attributeName="d">` or JS there); `polygon()` interpolates only between equal vertex counts, which
is what shape-morph's `toMorphPair()` produces, at the cost of faceted curves.

**Community ports** (unofficial; not endorsed by Google): `shape-morph` (MIT; `Morph`, `getShape`,
`toPathD`, `toMorphPair`, an `AnimatedMorph` helper and React bindings) and `material-shapes-ts`
(Apache-2.0; `MaterialShapes`, `Morph`, `animateMorph`, Vue bindings). Both port Android's `graphics-shapes`
library. Two things to watch in shape-morph:

- `AnimatedMorph`'s `spring` option takes a friction coefficient as `damping` (default 12), not Material's
  damping ratio: convert with `damping = 2 × ratio × √stiffness` (about 33.9 for fast spatial, 0.6 / 800).
  It also clamps the drawn shape to progress 0..1, so the overshoot never shows. The closed-form spring above
  has neither problem.
- Its docs say CSS cannot transition between `path()` values. That holds only when the command lists
  differ; a `Morph` pair interpolates.

### Clipping caveats

`clip-path` and `mask` clip everything the element paints and change how it receives input:

| Clipped | Effect | Fix |
|---|---|---|
| Focus ring (`outline`) | Cut away, so keyboard focus becomes invisible | Keep the focusable element unclipped; clip a child layer. Draw the ring on the unclipped element. If an ancestor's `overflow` clips the space around it, inset the ring with `--md-sys-state-focus-indicator-inner-offset` (−3px). |
| Shadow (`box-shadow`) | Cut away | Put `filter: var(--m3e-elevation-drop-shadow-levelN)` on an unclipped parent; the filter follows the clipped silhouette. |
| Hit-testing | Clicks in the clipped-out area fall through to what is behind; spiky shapes lose a lot of target | Make the unclipped parent the target, at least `--m3e-min-target-size` (48px) in each direction (Material suggests 48×48dp for touch and 44×44dp for pointer targets). |
| Border | Cut along the clip edge | Stroke an inline SVG path instead. |
| Children that overflow (badges, menus) | Cut off | Place them outside the clipped element. |

```css
.shape-action {
  position: relative;
  display: grid;
  place-items: center;
  inline-size: 96px;
  aspect-ratio: 1;
  border: 0;
  background: none;
  border-radius: var(--md-sys-shape-corner-full); /* the focus ring follows this */
  filter: var(--m3e-elevation-drop-shadow-level1); /* follows the flower, not the box */
}
.shape-action__bg {
  position: absolute;
  inset: 0;
  background: var(--md-sys-color-primary-container);
  clip-path: var(--m3e-shape-flower); /* add the url(#m3-shape-flower) fallback shown earlier for pre-shape() browsers */
}
.shape-action__label {
  position: relative;
  color: var(--md-sys-color-on-primary-container);
}
.shape-action:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
```

```html
<button class="shape-action">
  <span class="shape-action__bg" aria-hidden="true"></span>
  <span class="shape-action__label">Start</span>
</button>
```

`--m3e-elevation-drop-shadow-level0` to `-level5` are helpers in the token file: the same two shadow layers
as the `--m3e-elevation-shadow-level*` box-shadow helpers, written as `drop-shadow()` filters. `drop-shadow()`
takes no spread, so the ambient layer is slightly tighter than the box-shadow version. When the shape lifts
on hover or drag, switch to a higher level as [elevation.md](elevation.md) describes, and transition
`filter` with an effects helper, not a spatial one.

### Browser support

Checked September 2026.

| Feature | Chrome | Firefox | Safari | Status |
|---|---|---|---|---|
| Logical radius longhands (`border-start-start-radius`, ...) | 89 | 66 | 15 | Baseline widely available |
| `:dir()` | 120 | 49 | 16.4 | Baseline widely available (since 2026-06) |
| Outline follows `border-radius` | 94 | 88 | 16.4 | Widely supported |
| `clip-path: url(#id)` to an inline SVG clipPath | yes | yes | yes | Widely available |
| `clip-path: path()` | 88 | 71 | 13.1 | Baseline widely available |
| `clip-path: shape()` | 135 | 148 | 18.4 | Baseline newly available (2026-02) |
| `linear()` easing (the `-linear` helpers) | 113 | 112 | 17.2 | Widely supported |
| CSS `d` property (animating SVG paths) | 52 | 97 | no | Not in Safari |
| `corner-shape` | 139 | preview only | preview only | Not Baseline |
| `border-shape` | 147 (experimental) | no | no | Experimental |

## Do and don't

| Do | Don't | Why |
|---|---|---|
| Take every radius from `--md-sys-shape-corner-*` or `--md-sys-shape-corner-value-*`, via a component property. | Hard-code radii in component CSS. | A style or component change should be one edit. |
| Use `--md-sys-shape-corner-full` only when all four corners are full. | Combine 9999px with small radii. | CSS scales all radii by one factor, which squares off the small corners. |
| Animate between concrete lengths (half the height ↔ target). | Transition from or to 9999px or `infinity`. | The corners stall, then flash square under an overshooting curve. |
| Use `50%` only for circles on square boxes. | Use `50%` for pills. | Percent radii are per axis and give elliptical ends. |
| Nest with inner = outer − padding. | Reuse the parent's radius on a child. | Equal radii make the gap look thicker at the corners. |
| Keep dense and text-heavy containers at extra-small to medium radii. | Put full or large corners on text cards or tables. | Big curves take the corner space content needs; Material cautions against it. |
| Put library shapes on imagery, avatars, decoration or one focal metric. | Put abstract shapes on text-heavy containers or on every element. | Unexplained variety reads as clutter and hurts legibility. |
| Repeat one shape at one size, evenly spaced. | Mix many shapes and sizes, or overlap them. | Uniformity lets the shape read as a system. |
| Pair a shape change with color, icon or label. | Use shape as the only state signal, or give a shape a fixed meaning. | Shape alone is easy to miss and is not semantic. |
| Clip a child layer; keep the focusable element unclipped and at least `--m3e-min-target-size` (48px) square. | Clip the button itself. | The clip hides the focus ring and shadow and shrinks the hit area. |
| Shadow a clipped shape with `filter: var(--m3e-elevation-drop-shadow-levelN)` on its unclipped parent. | Put `box-shadow` on the clipped element, or hand-write `drop-shadow()` values. | The clip cuts a box shadow away; the helpers keep shadows on the elevation levels. |
| Give joined groups inner corners below the outer step (skill default 4px with 2px gaps). | Round every item of a group to the outer radius. | Equal corners break the group into separate cards. |
| Use logical longhands for start/end and inner corners. | Use physical corner properties for start/end meaning. | Start/end must mirror in RTL. |
| Generate matched `shape()` pairs for library morphs. | Transition between two unrelated `--m3e-shape-*` values. | Mismatched commands snap at 50% instead of morphing. |
| Keep text and icons still while a shape morphs. | Animate text width or other elements alongside the morph. | Competing motion hides the morph's message. |
| Turn decorative morphs off under reduced motion. | Rely on CSS helpers alone for JS morphs. | The reduced-motion block only reaches CSS that uses the helpers. |
| Treat `corner-shape: bevel` as an optional extra for cut corners. | Apply `squircle` to the M3 scale. | M3 corners are circular arcs; superellipses change every token's look. |

## Auditing

Each check passes or fails. The consolidated list is in `references/audit-checklist.md`.

1. **Scale conformance**: every computed corner radius is 0, 4, 8, 12, 16, 20, 28, 32 or 48px, or full
   (half the shorter side), unless it is a documented custom value or an optical-roundness result. Check
   `getComputedStyle(el).borderTopLeftRadius` (and the other three) across the page.
2. **Tokenized**: component CSS references `--md-sys-shape-corner-*` / `--md-sys-shape-corner-value-*`
   (directly or through a component property); grep finds no literal px radii in component rules, and every
   radius override carries a unit (`0px`, not `0`).
3. **Full is a stadium**: no non-square element uses `border-radius: 50%` for a pill; pills show semicircular
   ends.
4. **No 9999px mixing or animation**: no element combines 9999px (or `infinity`) with other non-zero radii,
   and no transition or keyframe has 9999px at either end.
5. **Nested radii are optical**: a rounded child inside a padded rounded parent has radius ≈
   max(0, parent − padding), within one scale step, and never the parent's radius. In joined groups the
   inner corners sit below the outer step and come from `--md-sys-shape-corner-value-*` tokens (skill
   default where Material publishes none: 4px inner, 2px gap, outer corners from the nesting rule).
6. **Dense containers stay modest**: text-heavy cards, tables and long lists use medium (12px) or less at
   rest and never full. A state change such as a selected list item going to large is fine.
7. **RTL mirroring**: with `dir="rtl"`, start/end shapes and inner corners mirror; no physical
   `border-top-left-radius` (or 4-value shorthand) expresses start/end meaning.
8. **Library shapes are restrained and non-semantic**: abstract shapes appear only on imagery, avatars,
   decoration, progress or one focal element; they are few, uniform in size, not overlapping and 1:1 unless
   stretching is deliberate, and no state is shown by shape alone.
9. **Clipped elements stay usable**: every shaped interactive element has an unclipped target of at least
   `--m3e-min-target-size` (48×48px), a fully visible focus ring when tabbed to, and a shadow (if any) from
   a `--m3e-elevation-drop-shadow-level*` filter on an unclipped parent (a hand-written `drop-shadow()`
   chain passes only if it equals a level exactly, as in the checklist's SHP-13).
10. **Morphs are purposeful, spatial and reduce-aware**: each morph is triggered by interaction, state,
    progress or environment; it uses a spatial spring helper whose speed fits the element's size (fast
    spatial for press, toggle and selection morphs on small and medium controls; a product that drives all
    its plain button presses with default effects instead, as interaction-states.md allows, also passes);
    library morphs interpolate smoothly (no snap at 50%); with `prefers-reduced-motion: reduce` decorative
    morphs don't play.

## Sources

- Material Design 3, Shape overview and principles: https://m3.material.io/styles/shape/overview-principles
- Material Design 3, Corner radius scale: https://m3.material.io/styles/shape/corner-radius-scale
- Material Design 3, Shape morph: https://m3.material.io/styles/shape/shape-morph
- Material Design 3 blog, Building with M3 Expressive (May 2025): https://m3.material.io/blog/building-with-m3-expressive
- Material Design 3, Get started: https://m3.material.io/get-started
- Material Design 3, Usability overview: https://m3.material.io/foundations/usability/overview
- Material Design 3, Applying M3 Expressive: https://m3.material.io/foundations/usability/applying-m-3-expressive
- Material Design 3, Motion (how it works; specs; applying transitions):
  https://m3.material.io/styles/motion/overview/how-it-works,
  https://m3.material.io/styles/motion/overview/specs,
  https://m3.material.io/styles/motion/transitions/applying-transitions
- Material Design 3, Structure (target sizes): https://m3.material.io/foundations/designing/structure
- Material Design 3, Applying icons: https://m3.material.io/styles/icons/applying-icons
- Material Design 3, Components (exact per-component shape values): https://m3.material.io/components
- Material Design 3, Loading indicator: https://m3.material.io/components/loading-indicator/overview
- Material Design 3, Develop for web: https://m3.material.io/develop/web
- Jetpack Compose `MaterialShapes` reference: https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialShapes
- AndroidX source (Compose Material 3 shapes, tokens, `AnimatedShape`, `LoadingIndicator`): https://github.com/androidx/androidx
- Material Web shape docs: https://github.com/material-components/material-web/blob/main/docs/theming/shape.md
- Material Components for Android shape docs: https://github.com/material-components/material-components-android/blob/master/docs/theming/Shape.md
- CSS Shapes 1 (`shape()`, `path()` interpolation): https://drafts.csswg.org/css-shapes-1/
- CSS Borders 4 (`corner-shape`): https://drafts.csswg.org/css-borders-4/
- MDN, `corner-shape`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape
- Browser compat data and Baseline status: https://github.com/mdn/browser-compat-data, https://github.com/web-platform-dx/web-features
- shape-morph: https://github.com/Thereallo1026/shape-morph (npm `shape-morph`)
- material-shapes-ts: https://github.com/ruanspies/material-shapes-ts (npm `material-shapes-ts`)
