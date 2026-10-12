# Audit checklist

A pass/fail checklist for reviewing any UI against the Material 3 Expressive foundations: a live page, HTML
and CSS in any framework, a screenshot or a design spec. Every check has an ID, a yes/no question, a way
to verify it, an exact pass criterion, a default severity and a link to the reference section that
explains the rule. Values come from the topic references and `assets/m3-expressive-tokens.css`. Follow a
check's link for the reasoning and the sources.

## Contents

1. [Quick audit](#quick-audit)
2. [How to run an audit](#how-to-run-an-audit)
3. [Principles and hierarchy (PRI)](#principles-and-hierarchy-pri)
4. [Layout and spacing (LAY)](#layout-and-spacing-lay)
5. [Color (COL)](#color-col)
6. [Typography (TYP)](#typography-typ)
7. [Shape (SHP)](#shape-shp)
8. [Motion (MOT)](#motion-mot)
9. [Elevation (ELV)](#elevation-elv)
10. [Interaction states (STA)](#interaction-states-sta)
11. [Accessibility cross-checks (A11Y)](#accessibility-cross-checks-a11y)
12. [Audit toolkit](#audit-toolkit): grep set, console snippets T1–T8, CSS probes
13. [Findings report template](#findings-report-template)

## Quick audit

For a short review, run these 12 checks. They catch the failures that show up most often and cost the
most. Each ID links to the full entry with its verification steps.

| # | ID | Question | Passes when |
|---|---|---|---|
| 1 | [A11Y-01](#a11y-01-text-contrast-in-all-six-contexts) | Does all text meet contrast in light and dark at standard, medium and high contrast? | 4.5:1, or 3:1 for text at least 24px regular or 18.67px bold (T1 in each context) |
| 2 | [STA-04](#sta-04-focus-ring-geometry) | Does keyboard focus show the M3 ring? | 3px `outline` in the `secondary` role, offset 2px (or -3px where clipped), `:focus-visible` only; `outline: none` only beside an approved replacement ring |
| 3 | [A11Y-03](#a11y-03-target-size-and-spacing) | Are targets big enough and far enough apart? | Hit area at least 48×48px (`--m3e-min-target-size`; 44×44px pointer-only); 8px between separate targets, except rows, segments and connected groups that tile a container (T5) |
| 4 | [MOT-09](#mot-09-reduced-motion) | Does reduced motion remove slides, scales, morphs and parallax, including JS motion? | Only short fades remain under `prefers-reduced-motion: reduce` |
| 5 | [COL-01](#col-01-roles-only) | Does every color come from a role? | No hex, `rgb()`, `hsl()` or `--md-ref-palette-*` in component styles |
| 6 | [COL-02](#col-02-on-role-pairs) | Is text always the `on-` partner of its fill? | `on-X` on `X`, `on-X-container` on `X-container`, `on-surface`/`on-surface-variant` on surfaces |
| 7 | [PRI-01](#pri-01-one-primary-action-per-screen) | Is there exactly one dominant primary action per screen? | One `primary`-filled action, the largest action (button or FAB) on the screen, within easy reach; list rows, sliders and form controls don't count |
| 8 | [LAY-01](#lay-01-scaffold-breakpoints) | Does the scaffold change only at M3 breakpoints? | Thresholds 600, 840, 1200, 1600px only (T6); none at 768 or 1024px |
| 9 | [TYP-01](#typ-01-every-text-style-is-on-the-scale) | Is all text on the type scale? | Sizes 57, 45, 36, 32, 28, 24, 22, 16, 14, 12, 11px with matching line height, weight, tracking (T2) |
| 10 | [SHP-01](#shp-01-radii-on-the-scale) | Are all corner radii on the scale? | 0, 4, 8, 12, 16, 20, 28, 32, 48px or full; no `50%` pills (T3) |
| 11 | [ELV-01](#elv-01-shadows-use-the-six-levels) | Is every shadow one of the six levels? | Computed `box-shadow` is `none` or a level helper (clipped shapes: the drop-shadow helpers); nothing rests at 4 or 5 (T4) |
| 12 | [STA-02](#sta-02-state-layer-opacities) | Are state layers at the token opacities? | Hover 0.08, focus 0.1, pressed 0.1, dragged 0.16, in the content color |

If time allows one more sweep, these are the other failures that turn up most, with the checks that
catch them: a raw hex or px value where a token or helper exists (COL-01, LAY-13, SHP-02), `--md-ref-*`
read by components (PRI-08), `50%` pills and `9999px` next to or animated to other radii (SHP-03 to
SHP-05), surface-tint overlays (ELV-06), shadows doing the work of tone between flat regions (ELV-03,
ELV-04), focus marked by a tint with no ring (STA-04), and color or opacity that bounces (MOT-02).

A quick audit is not a verdict on the whole product. Record it as such in the report.

## How to run an audit

### Inputs

| Input | What it can show | How to inspect it |
|---|---|---|
| Live page or URL | Every check | Chromium DevTools: Elements and Computed panes; Elements › Force state (`:hover`, `:active`, `:focus-visible`); Rendering tab (emulate `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`, `forced-colors`, vision deficiencies); device toolbar for exact widths; Animations panel (slow playback to 10%); Accessibility pane. Console snippets [T1–T8](#console-snippets). axe or Lighthouse for a second opinion on contrast and names. |
| Source code (any framework) | Name-level checks (which tokens are used), plus most value checks | The [grep set](#grep-set). React, Vue, Svelte and similar render to the same DOM, so run the live checks on the rendered page too. For CSS-in-JS, adapt the patterns to camelCase keys (`borderRadius: 18`, `boxShadow`, `fontSize`). For utility frameworks, read the theme config and treat arbitrary values (`rounded-[18px]`, `p-[18px]`) as literals. |
| Screenshot | Visual checks only: hierarchy, pane layout at that width, spacing, radii, shadow extent, contrast by sampling | Convert device pixels to CSS px by dividing by the device pixel ratio (a 1170px-wide capture at ratio 3 is 390 CSS px). If the ratio is unknown, ask for it. Sample text color from the darkest stroke pixel and the background from a flat area next to it. Checks that need code or interaction are "not verified", never "pass". |
| Design spec (Figma or similar) | Tokens bound to layers, modes, frame widths, motion specs, redlines | Look for color, type, corner and spacing variables on every layer (detached values count as literals); light/dark and contrast modes; frames at breakpoint widths; prototype motion given as spring damping and stiffness or curve plus duration; target redlines. |

### Passes, in order

1. **Inventory.** List the screens and states in scope; the primary goal and primary action of each
   screen; the hero moments; whether the product is utilitarian (finance, health records, admin, dense
   data) or expressive (media, social, personal); how it gets its tokens (this skill's token file,
   Material Web, its own system); the locales it ships (RTL? taller scripts?); and its input types.
2. **Static pass.** Run the [grep set](#grep-set) on the sources and T6 on the live page. Read the theme
   layer: roles, contrast blocks, typefaces, motion scheme.
3. **Layout pass.** Resize through the widths below in LTR, then in RTL.
4. **Foundations pass** at one representative width per class: hierarchy (PRI), color, type (T2), shape
   (T3), elevation (T4).
5. **Context pass.** Repeat the color and contrast checks in all six color contexts and in forced colors.
   Run T1 in each context.
6. **Interaction pass.** Mouse hover, keyboard (Tab, Shift+Tab, arrows, Enter, Space, Escape), touch
   emulation, drag, disabled items. Run T5 at each width.
7. **Motion pass.** Trigger every animation at normal speed and at 10%, in both motion schemes if the
   product can switch, then again with reduced motion. Run T7 in each state.
8. **Accessibility cross-checks**, then write the report.

### Contexts to cover

- **Widths (px):** 360 and 412 (compact phones), 599 and 600, 700, 839 and 840, 1000, 1199 and 1200, 1400,
  1599 and 1600, 1700. Heights 479 and 480 for landscape phones.
- **Color: six contexts.** Light and dark, each at standard, medium and high contrast. With this skill's
  token file, switch them with attributes (snippet below). Otherwise use the product's own settings. DevTools
  emulation reaches only light/dark and `prefers-contrast: more`.
- **Forced colors:** Rendering › Emulate CSS media feature `forced-colors: active`.
- **Motion:** expressive and standard schemes (`data-motion-scheme`); `prefers-reduced-motion: reduce`.
- **Direction and script:** `dir="rtl"`; `lang` values the product ships; `data-language-height="large"`
  as a stress test.
- **Text size:** browser default font size 32px (200%), page zoom 200% and 400%.

```js
// Context switches for pages that load m3-expressive-tokens.css.
// Delete an attribute to follow the OS again (removeAttribute or `delete html.dataset.theme`).
const html = document.documentElement;
html.dataset.theme = 'dark';              // 'light' | 'dark'
html.dataset.contrast = 'medium';         // 'standard' | 'medium' | 'high'
html.dataset.motionScheme = 'standard';   // 'expressive' | 'standard'
html.dataset.languageHeight = 'large';    // 'small' | 'medium' | 'large' | 'extra-large'
html.dir = 'rtl';                         // 'ltr' | 'rtl'
```

### Recording findings

- **Verdict per check:** Pass, Fail, N/A or Not verified. Every check in scope gets one.
- **One finding per check and root cause.** When the same cause shows up in many places, write one
  finding with a count and two or three representative locations.
- **Location:** `file:line` plus the selector for code; screen › region › element @ width and context for
  visuals (for example "Settings › footer › caption @ 412px, dark/medium"); frame and layer name for specs.
- **Observed:** the measured value and how you got it ("3.96:1 via T1"). **Expected:** the exact value from
  the pass criterion. **Fix:** the token, helper or pattern that makes it pass.
- Use the [findings report template](#findings-report-template).

### Severity

| Level | Meaning | Examples |
|---|---|---|
| Blocker | Breaks accessibility (a WCAG 2.2 A or AA failure in any context the product ships; content or controls unreachable; focus invisible; motion with no reduced path) or core usability (the primary task can't be completed; text or controls clipped, overlapping or lost at a supported width) | Body text at 3.1:1 in dark theme; no focus ring; a modal that doesn't trap focus |
| Major | A clear deviation from the M3 foundations that users or maintainers will notice | Wrong role pairs; off-scale type, radii or shadows; hard-coded colors; missing contrast levels; device-named breakpoints; bouncing color changes |
| Minor | Polish | An off-scale 18px gap; a helper composed on `:root`; a speed one step off |

Each check lists its default severity. Raise it when the instance is worse: any finding that produces a
blocker outcome (a hard-coded color that fails 4.5:1 in dark theme) is a blocker, and a minor finding that
repeats across the product or sits on the primary action becomes major. Never lower a blocker.

### Not applicable vs not verified

- **N/A** means the UI doesn't have the thing the check is about: no drag and drop (STA-14, ELV-08), no
  library shapes (SHP-10, SHP-11, SHP-14), no custom colors (COL-11), no generated scheme (COL-12), no modal
  layers (ELV-10, A11Y-05), no density option (LAY-15), no resizable panes (LAY-12). RTL checks (LAY-17,
  LAY-18, SHP-09) are N/A only if the product ships no right-to-left locale. Language-height checks
  (TYP-13) are N/A only for products whose content is entirely Latin (except Vietnamese), Greek, Cyrillic
  or Hebrew.
- **Not verified** means the check applies but the input can't show it (motion from a screenshot, focus
  order from a static spec). List these in the report as open items.
- **Never N/A:** the accessibility cross-checks, and missing support the system expects. A product with
  no dark theme or no medium contrast fails COL-08; it is not exempt from it.

### Products that don't use this skill's token file

Pass criteria are written as values, so any implementation that produces them passes: Material Web
tokens, a Tailwind theme, hand-written variables. `--m3e-*` names in the checks are this skill's web
helpers; accept anything that yields the same value. Name-level checks (PRI-08, COL-01, SHP-02, MOT-01,
LAY-13) ask for a token layer: they pass when values come from named tokens that map to the M3 values, and
fail on scattered literals. Known differences to expect from stable Material Web: 0.12 focus and pressed
opacities (fails STA-02), `--md-elevation-level` taking a level index 0–5 rather than a distance (see
ELV-13), and no emphasized type styles.

## Principles and hierarchy (PRI)

Reference: [expressive-principles.md](expressive-principles.md).

#### PRI-01 One primary action per screen
**Major.** Does each screen have exactly one visually dominant primary action?
- **Verify:** Visual: blur a screenshot (about 8px Gaussian) or squint; one action should still stand out.
  Live or code: per screen, list the actions (buttons, FABs, links styled as buttons) and note which are
  filled with the `primary` role (or `primary-container` used as an action); compare their
  `getBoundingClientRect()` areas with each other. Leave list rows, sliders, switches and other form
  controls out of the comparison.
- **Pass:** One primary action per screen (per pane when panes hold separate destinations): filled with
  `primary`/`on-primary` (or `primary-container`/`on-primary-container` on a large surface), the largest
  action (button or FAB) on the screen, and within easy reach (low on touch screens, or next to the content
  it acts on). A full-width list row or a slider may have a bigger box; it is not a competing action. Fail
  when two or more actions share the largest size and the strongest role. Screens with nothing to act on
  are N/A.
- **Ref:** [expressive-principles.md: Hierarchy around one primary action](expressive-principles.md#hierarchy-around-one-primary-action)

#### PRI-02 Supporting actions step down
**Major.** Do secondary and tertiary actions rank visibly below the primary action?
- **Verify:** Compare fills, label styles and box sizes of every action on the screen with the primary.
- **Pass:** Secondary actions use `secondary-container`/`on-secondary-container`; tertiary actions have no
  container, with `primary` text or an `outline` border; every supporting action is smaller than the
  primary and never `primary`-filled; supporting labels use baseline `label-large` (14px, weight 500), while
  the primary may take its emphasized twin or, on a larger button, an emphasized title or headline role
  (TYP-05); essential actions never get a smaller or weaker shape than optional ones; tertiary actions
  still keep 48×48px targets (A11Y-03).
- **Ref:** [expressive-principles.md: Hierarchy around one primary action](expressive-principles.md#hierarchy-around-one-primary-action)

#### PRI-03 At most two hero moments
**Major.** Does the product have at most two hero moments, each on a key or emotionally weighted
interaction?
- **Verify:** List every moment that combines three or more tactics at full strength: a library shape or
  32/48px corners, emphasized display or headline type, a spatial spring or shape morph, a vivid accent
  container. For each, ask whether it carries emotional weight and whether it is a core interaction.
- **Pass:** At most two per product; each answers yes to at least one question (finishing a goal,
  starting the core activity, a key figure); none sits on settings, forms or routine flows; while it
  plays, the surrounding controls step down or hide (Material's example hides the navigation bar).
- **Ref:** [expressive-principles.md: Combine tactics to create hero moments](expressive-principles.md#7-combine-tactics-to-create-hero-moments)

#### PRI-04 One focal point, no stacked tactics
**Major.** Can you name the one thing each screen emphasizes?
- **Verify:** For each screen, count accent container roles in use, library shapes, elements set in
  emphasized type and spatial spring animations, then write the focal element down in one line.
- **Pass:** One nameable focal element per screen; secondary screens use fewer and quieter tactics than the
  hero screen, and tertiary screens (settings, history) are the quietest. Fail when no focal element can
  be named, or when several tactics run at full strength on one screen (several accent colors, mixed
  shapes, emphasized type everywhere, bouncing motion).
- **Ref:** [expressive-principles.md: Restraint rules](expressive-principles.md#restraint-rules)

#### PRI-05 Familiar patterns intact
**Major.** Do lists, labels and navigation work the way people expect?
- **Verify:** Code: collections use `ul`/`ol`/`li`, `table`, or `role="list"`/`"grid"`; primary and
  secondary actions contain visible text. Visual: lists read as rows or a regular grid; navigation sits
  at the bottom (compact) or the leading edge (wider).
- **Pass:** No list is replaced by a free-form collage; primary and secondary actions keep visible text
  labels; icon-only controls have an accessible name without role words ("Share", not "Share button");
  navigation sits where LAY-02 puts it. Google's tests lost usability when a playlist became scattered art
  and when email actions lost their labels.
- **Ref:** [expressive-principles.md: Restraint rules](expressive-principles.md#restraint-rules)

#### PRI-06 Grouping and containment
**Minor.** Does containment make the structure readable?
- **Verify:** Measure gaps inside groups and between groups; count container nesting levels, starting
  below the page body; compare the key group's padding and surface with the others.
- **Pass:** Related items share a container or tight spacing; the gap between groups is larger than the
  gap inside a group; nesting stays at about two container levels, a skill heuristic. The page body is
  not a level and neither is an app bar, so a content region with groups inside it (color.md's settings
  screen) is two. Nested containers use different surface roles (ELV-03); the most important group gets
  the most room and the brightest surface (COL-06).
- **Ref:** [expressive-principles.md: Contain content for emphasis](expressive-principles.md#4-contain-content-for-emphasis), [color.md: A grouped list screen](color.md#a-grouped-list-screen-settings)

#### PRI-07 Intensity matches the product
**Minor.** Is a utilitarian product (finance, health records, admin, dense data) held to calm settings?
- **Verify:** Classify the product during the inventory. Check the motion scheme (`data-motion-scheme` or
  the product's spring values), the corner mix, type styles and accent roles in use.
- **Pass:** Utilitarian products use the standard motion scheme (spatial damping 0.9), which is Material's
  advice; the skill also expects a uniform corner scale, baseline type with emphasized only for the key
  figure, and `primary` for the one key action on neutral surfaces. Any expressive swap is limited to one
  documented region (MOT-05). N/A for media, social and personal-expression products.
- **Ref:** [expressive-principles.md: Restraint rules](expressive-principles.md#restraint-rules)

#### PRI-08 Components read system tokens
**Major.** Do component styles read `--md-sys-*` tokens, `--m3e-*` helpers or the product's own component
tokens that point at them, never reference tokens?
- **Verify:** Grep set, PRI-08 line. Review each hit.
- **Pass:** No component rule reads `--md-ref-*` tokens (palette tones, typefaces, weights); only the theme
  layer does, for example a `:root` typeface swap. Product component tokens (`--app-card-shape`) point at
  system tokens or helpers. Literal values are covered per foundation: COL-01, TYP-01, SHP-02, MOT-01,
  ELV-01, LAY-13.
- **Ref:** [expressive-principles.md: Token architecture](expressive-principles.md#token-architecture)

#### PRI-09 Themes and schemes switch through tokens
**Major.** Do theme, contrast level and motion scheme change only by switching token values?
- **Verify:** Live: switch `data-theme`, `data-contrast` and `data-motion-scheme` on `<html>` (or the
  product's own settings) and watch every component follow. Code: grep set, PRI-09 line; component rules
  scoped to a theme that set literal values fail. Reload with a non-default theme stored and watch the
  first paint.
- **Pass:** Every surface, text, icon, focus ring and spring changes with the switch; theme-scoped rules,
  if any, only swap tokens; the stored theme and contrast apply before first paint (no flash of the wrong
  theme).
- **Ref:** [expressive-principles.md: How the shipped CSS file maps to the architecture](expressive-principles.md#how-the-shipped-css-file-maps-to-the-architecture)

#### PRI-10 Re-theming at the right tier and scope
**Minor.** Do theme overrides sit where they can take effect?
- **Verify:** Grep app CSS for declarations of `--md-ref-palette-*`, `--md-ref-typeface-*`,
  `--md-sys-color-*`, `--md-sys-color-shadow` and `--md-sys-color-scrim`, and note the selector of each.
  Confirm on screen that each override changes something.
- **Pass:** Colors are re-themed by overriding `--md-sys-color-*` roles (the shipped roles are resolved
  `light-dark()` literals, so palette overrides change nothing); typefaces are swapped with
  `--md-ref-typeface-brand`/`--md-ref-typeface-plain` on `:root`, or with the
  `--md-sys-typescale-*-font` tokens on a subtree; a subtree that overrides roles also redeclares, in the
  same rule, the helpers that read them (`--m3e-focus-indicator-color`, `--md-sys-color-surface-tint`,
  `--m3e-scrim`, `--m3e-elevation-shadow-level1` to `level5`, `--m3e-elevation-drop-shadow-level1` to
  `level5`). Fail when an override exists and nothing on screen changes.
- **Ref:** [expressive-principles.md: Theming and customization](expressive-principles.md#theming-and-customization)

#### PRI-11 Custom property naming
**Minor.** Do custom properties the product defines use its own prefix?
- **Verify:** Grep set, PRI-11 line (lists `--md-*` and `--m3e-*` names declared in the app that the
  token file doesn't define).
- **Pass:** No invented `--md-*` or `--m3e-*` names (redeclaring an existing token or helper is fine);
  product tokens use a product prefix such as `--app-`, and custom colors from
  `scripts/generate-scheme.mjs` count as product tokens (`--app-color-<name>` by default, another prefix
  through `--custom-prefix`); `--m3e-*` properties are treated as this skill's helpers, not Material
  tokens.
- **Ref:** [expressive-principles.md: Your own component tokens](expressive-principles.md#your-own-component-tokens)

## Layout and spacing (LAY)

Reference: [layout.md](layout.md).

#### LAY-01 Scaffold breakpoints
**Major.** Do pane count, navigation type and window margins change only at 600, 840, 1200 and 1600px?
- **Verify:** Live: run T6 to list every width in media and container conditions. Code: grep set, LAY-01
  line (includes `matchMedia` calls). Then resize across 599/600, 839/840, 1199/1200 and 1599/1600px and
  watch the scaffold switch exactly there. Spec: frames exist for each class.
- **Pass:** Scaffold thresholds are only 600, 840, 1200 and 1600px (large and extra-large are optional; a
  product may treat 840px and up as one class); device-named widths (768, 1024, 1280px) drive no scaffold
  change; thresholds are in px (em breakpoints are a documented deviation at best); exclusive upper bounds
  are written `width < 840px` or `max-width: 839.98px`, never `max-width: 839px`, which leaves a gap at
  fractional widths. Component-level container queries are judged under LAY-08.
- **Ref:** [layout.md: Width classes](layout.md#width-classes), [Units and query rules](layout.md#units-and-query-rules)

#### LAY-02 Navigation per width class
**Major.** Does navigation take the form each width class calls for?
- **Verify:** Screenshots at 400, 700, 900, 1300 and 1700px; code rules that show and hide the navigation
  bar and rail.
- **Pass:** Compact (below 600px): navigation bar, or a modal expanded navigation rail. Medium (600–839px):
  collapsed rail with one pane, navigation bar with two panes, a modal expanded rail in either case.
  Expanded and wider (840px and up): navigation rail, collapsed or expanded; no bottom navigation bar.
  At 840px an expanded rail beside two panes must not crush the leading pane (collapse the rail or show
  one pane).
- **Ref:** [layout.md: Width classes](layout.md#width-classes), [What to change at each width class](layout.md#what-to-change-at-each-width-class)

#### LAY-03 Pane count
**Major.** Does the number of visible panes stay within the limits at every width?
- **Verify:** At 400, 700, 1000, 1400 and 1700px, count side-by-side content panes (children of the pane
  grid whose `display` is not `none`).
- **Pass:** Compact 1; medium 1, or 2 only for low-density content split 50/50 (equal widths within 1px);
  expanded and large 1 or 2; extra-large 1 to 3, where a third pane is a standard side sheet at most 400px
  wide (`--m3e-side-sheet-max-width`); never more than 3, and never 3 below 1600px.
- **Ref:** [layout.md: How many panes](layout.md#how-many-panes)

#### LAY-04 Window margins
**Major.** Are the side margins 16px below 600px and 24px from 600px?
- **Verify:** Measure from the window edge (or the rail's edge) to the first and last pane at 599 and
  600px, in LTR and RTL. Code: `--m3e-window-margin` or 16px/24px values on the page container.
- **Pass:** 16px on both sides below 600px; 24px from 600px; where a navigation rail sits, the rail takes
  that side's margin, so the first pane starts at the rail's edge with no extra 24px.
- **Ref:** [layout.md: Spacer and margins around panes](layout.md#spacer-and-margins-around-panes)

#### LAY-05 Pane spacer and centred split
**Minor.** Are side-by-side panes 24px apart, with a split layout's spacer centred?
- **Verify:** At 900 and 1300px measure the gap between panes. For a split layout, measure the spacer's
  centre against the window's: `const r = document.querySelector('[role="separator"]').getBoundingClientRect(); r.x + r.width / 2 - innerWidth / 2`
  (or use the gap between the panes), with the rail collapsed and expanded.
- **Pass:** 24px between panes at every class with two panes; in split layouts the spacer's centre sits at
  50% of the usable window width within ±1px, with and without the rail (the rail shrinks only the
  leading pane).
- **Ref:** [layout.md: Arrangements](layout.md#arrangements)

#### LAY-06 Fixed and flexible panes
**Minor.** Are fixed panes the documented widths, with at least one flexible pane?
- **Verify:** Read the fixed pane's width at 900 and 1300px; resize by ±100px and see which pane absorbs
  the change.
- **Pass:** Fixed pane 360px at 840–1199px and 412px from 1200px (`--m3e-fixed-pane-width-expanded` and
  `-large`); a third-pane side sheet at most 400px (`--m3e-side-sheet-max-width`), not the 412px fixed-pane
  width; at least one pane flexes with the window.
- **Ref:** [layout.md: Arrangements](layout.md#arrangements)

#### LAY-07 Extra width reveals content
**Minor.** When the window grows, does the layout show more instead of scaling up the compact layout?
- **Verify:** Compare screenshots at 400 and 1300px.
- **Pass:** Wider classes add a second pane, an expanded rail or more columns (a feed usually adds columns
  from 840px); components swap only for functional equivalents (navigation bar and rail, bottom sheet and
  menu, full-screen and basic dialog); an action keeps its icon and label at every size. Fail on one
  stretched column, or cards and lines scaled to fill a wide window.
- **Ref:** [layout.md: Moving between classes](layout.md#moving-between-classes)

#### LAY-08 Components respond to their pane
**Minor.** Do components inside panes adapt to the pane's width, not the window's?
- **Verify:** Code: component rules inside viewport `@media` width queries; panes declaring
  `container-type: inline-size` (or a `ResizeObserver` on the pane). Live: at 1300px with two panes, a
  component in the narrower pane uses its compact form.
- **Pass:** Scaffold decisions use viewport media queries; component layout uses container queries or
  pane-size observers.
- **Ref:** [layout.md: Container queries for each class](layout.md#container-queries-for-each-class)

#### LAY-09 Safety regions
**Major.** Does content stay clear of display cutouts, the status bar and gesture areas?
- **Verify:** Grep set, LAY-09 line. In DevTools device mode pick a phone with a cutout, rotate to
  landscape and inspect every edge.
- **Pass:** With `viewport-fit=cover`, bars and panes are padded with `env(safe-area-inset-*)`, using
  physical `left`/`right` (the one place physical sides stay correct in RTL); no text or control sits under
  a cutout or in the gesture area. Without `viewport-fit=cover` the browser insets the page and this passes.
- **Ref:** [layout.md: Scaffold and safety regions](layout.md#scaffold-and-safety-regions)

#### LAY-10 Live adaptation keeps state
**Major.** Does the layout follow resize, rotation, split screen and folding without losing state?
- **Verify:** Select an item, scroll a pane and type in a field, then drag the window across 840px and back
  (and rotate a device or emulator). Grep set, LAY-10 line.
- **Pass:** The class changes live; selection, scroll position and input survive (panes are hidden, not
  unmounted); layout never comes from the user agent or the physical screen size.
- **Ref:** [layout.md: Units and query rules](layout.md#units-and-query-rules), [Pane layouts](layout.md#pane-layouts)

#### LAY-11 Canonical layout behavior
**Minor.** Do list-detail and supporting-pane layouts behave as their canonical examples do?
- **Verify:** List-detail: at 700px select an item, resize to 900px, then clear the selection. Supporting
  pane: compare 839px with 840px.
- **Pass:** List-detail: back button only in the single-pane detail view; selection highlight only in the
  two-pane list; a placeholder or empty state in the detail pane when two panes show and nothing is
  selected; going from two panes to one shows the selected item's detail. Supporting pane: below the
  primary pane under 840px; beside it at a fixed 360px from 840px (412px from 1200px, this skill's
  inference). N/A for other layouts.
- **Ref:** [layout.md: List-detail](layout.md#list-detail), [Supporting pane](layout.md#supporting-pane)

#### LAY-12 Drag handle
**Major.** If panes can be resized, is the drag handle placed, sized and operable correctly?
- **Verify:** Tab to the handle; press the arrow keys, Enter and Space; inspect it in the Accessibility
  pane; `document.elementFromPoint()` 10px into each pane beside the handle should return the handle;
  reload and compare widths.
- **Pass:** Sits in the 24px spacer; focusable, with arrow keys stepping through snap points (collapsed,
  360px, 412px and the centred split from 840px; 50/50 or one full-width pane at medium) and Enter or Space
  moving to a preset (collapsing and restoring a fixed pane); exposes `role="separator"` with
  `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a label (a labelled `<button>` when it only
  toggles); hit area at least `--m3e-min-target-size` (48px) wide, reaching into both panes; visible
  focus ring; a quiet `outline`-colored pill at rest that shows when it is held; the chosen width persists,
  except temporary resizing for supporting panes. The bar's exact size is a component spec, not part of
  this check.
- **Ref:** [layout.md: Drag handle](layout.md#drag-handle)

#### LAY-13 Spacing values on the scale
**Minor.** Do spacing values come from the M3 spacing scale?
- **Verify:** Grep set, LAY-13 line; compare each px value with the scale. Count uses of
  `var(--md-sys-measurement-space…)`. Screenshot: measure gaps between aligned elements.
- **Pass:** Every padding, margin, gap and inset is 0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 36, 40, 48,
  56, 64 or 72px, preferably through `--md-sys-measurement-space0` to `--md-sys-measurement-space900`;
  off-scale values (18, 28, 30, 44px) appear only as documented app-level extensions named by the same rule
  (for example `--app-space225: 18px`); spacing is in px so it doesn't grow with the user's font size.
- **Ref:** [layout.md: Tokens](layout.md#tokens), [4dp or 8dp?](layout.md#4dp-or-8dp)

#### LAY-14 Spacing lives on parents
**Minor.** Is spacing set as parent padding and gap, with the system spacing tokens left untouched?
- **Verify:** Grep set, LAY-14 line (child-margin patterns and redefined spacing tokens).
- **Pass:** Containers use `padding` and `gap`; margins only for space beyond a parent's padding or for page
  layout; adapting spacing switches which token a component maps to (button top padding `space125` →
  `space200`), never redefines `--md-sys-measurement-space*`.
- **Ref:** [layout.md: Choosing and applying spacing](layout.md#choosing-and-applying-spacing)

#### LAY-15 Density is opt-in
**Major.** If the UI offers density levels, are they a user choice that keeps targets intact?
- **Verify:** Grep for density rules inside width or orientation media queries (there should be none).
  Toggle the setting; measure a list row's height per step and run T5.
- **Pass:** Density changes only through a user setting, never with breakpoint or orientation; each step
  (−1, −2, −3) removes 4px of height, 2px top and 2px bottom, and leaves inline padding and font size
  alone; menus, snackbars, dialogs and the density control itself stay at default; every target stays at
  least 48×48px. N/A without a density option.
- **Ref:** [layout.md: Density](layout.md#density)

#### LAY-16 Layout grid columns
**Minor.** If a page grid is used, does it have the column counts Material shows?
- **Verify:** Read `grid-template-columns` of the page grid at 400, 700 and 1300px.
- **Pass:** 4 columns below 600px, 8 at medium and expanded, 12 at large and extra-large. Material publishes
  no gutters, so any consistent gutter passes (this skill's default: 16px, then 24px from 600px).
- **Ref:** [layout.md: Grids and rulers](layout.md#grids-and-rulers)

#### LAY-17 RTL mirroring
**Major.** Under `dir="rtl"`, does the layout mirror, with the known exceptions left as they are?
- **Verify:** Set `document.documentElement.dir = 'rtl'` and screenshot every class next to its LTR twin.
  Grep set, LAY-17 line; review hits outside `env(safe-area-inset-*)` rules.
- **Pass:** Navigation rail on the right; pane order and leading/trailing spacing swapped; badges at the top
  left; directional icons (back, forward, send) flipped; swipe gestures mirrored; horizontal offsets written
  with logical properties. Left alone: media controls, clocks, clockwise circular progress, refresh arrows;
  linear progress fills right to left except in Hebrew; Hebrew timelines and media controls, and Persian
  and Urdu charts, stay LTR.
- **Ref:** [layout.md: Bidirectionality and RTL](layout.md#bidirectionality-and-rtl), [Logical properties and RTL](layout.md#logical-properties-and-rtl)

#### LAY-18 Bidirectional text fragments
**Minor.** Are LTR fragments inside RTL text isolated?
- **Verify:** In RTL, render a sentence holding an email address, a URL and a phone number. Look for `<bdi>`
  or `dir="ltr"` around those fields and `dir="auto"` on user-generated content.
- **Pass:** An email address keeps its parts in order (domain to the right of the user name), phone digits
  stay in order, and RTL text is never forced to LTR direction.
- **Ref:** [layout.md: Bidirectionality and RTL](layout.md#bidirectionality-and-rtl)

## Color (COL)

Reference: [color.md](color.md). Baseline values are the 3P scheme at standard contrast unless stated.

#### COL-01 Roles only
**Major** (blocker when the literal fails contrast in any context). Does every color in component styles
resolve to a color role?
- **Verify:** Code: grep set, COL-01 line, over component styles (the token file and generated scheme
  files are excluded). Live: switch through the six contexts; an element whose color never changes is
  hard-coded. Spec: layers with detached hex fills.
- **Pass:** Every color resolves to a `--md-sys-color-*` role or a documented custom group (for example
  `--app-color-success`); literals appear only where the color is the content (data swatches, logos) or as
  forced-colors system colors.
- **Ref:** [color.md: Using roles in component CSS](color.md#using-roles-in-component-css)

#### COL-02 On-role pairs
**Major** (blocker when any context then fails A11Y-01). Is text and icon color always the partner of the
fill beneath it?
- **Verify:** For each rule that sets a background role, read the color of the same element and its
  children. Then set `data-contrast="medium"` and `"high"`: wrong pairs collapse there (baseline `primary`
  text on `primary-container` falls from 5.00:1 to 1.45:1 at medium; `on-surface` on `secondary-container`
  falls to 3.25:1 at medium and 2.26:1 at high).
- **Pass:** `on-X` on `X`; `on-X-container` on `X-container`; `on-surface` or `on-surface-variant` on any
  surface, `surface-dim`, `surface-bright` or surface container (`primary`, `secondary`, `tertiary` and
  `error` also work as accent text there); `inverse-on-surface` on `inverse-surface`, with
  `inverse-primary` for an action; `on-X-fixed` or `on-X-fixed-variant` on `X-fixed` and `X-fixed-dim`.
- **Ref:** [color.md: Pairing matrix](color.md#pairing-matrix)

#### COL-03 Containers are fills, not foregrounds
**Major.** Are accent `*-container` roles kept out of text, icon and stroke colors?
- **Verify:** Grep set, COL-03 line.
- **Pass:** `primary-container`, `secondary-container`, `tertiary-container` and `error-container` never
  set `color`, `fill`, `stroke`, `border-color` or `outline-color`; boundaries use `outline` or
  `outline-variant`.
- **Ref:** [color.md: Vocabulary](color.md#vocabulary)

#### COL-04 Theme islands paint their own text
**Major.** Does every element that switches theme, contrast or scheme set its own background and text
color?
- **Verify:** Find elements carrying `data-theme`, `data-contrast` or a scoped scheme class; run T1 inside
  them in each context.
- **Pass:** Each sets `background` and `color` from roles (typically `surface` and `on-surface`), because
  an inherited `color` was already resolved in the parent's theme; no island shows the page's dark text on
  its own dark surface.
- **Ref:** [color.md: How the shipped token file is organized](color.md#how-the-shipped-token-file-is-organized)

#### COL-05 Surface roles build the hierarchy
**Major.** Are surfaces taken from the surface roles, consistently at every width?
- **Verify:** Read the computed background of the body and each region; resize across 600, 840 and 1200px;
  grep set, COL-05 line.
- **Pass:** The page uses `surface`; regions use `surface-container-lowest` to `surface-container-highest`,
  `surface-dim` or `surface-bright`; a region keeps its role across breakpoints (larger windows may add
  containers if they do so consistently); no new uses of the legacy `background`, `on-background` or
  `surface-variant` (use `surface`, `on-surface` and `surface-container-highest`).
- **Ref:** [color.md: Surface roles](color.md#surface-roles), [Legacy roles](color.md#legacy-roles)

#### COL-06 Emphasis by accent family and surface tone
**Minor.** Does each region's key action or takeaway stand apart through role contrast?
- **Verify:** Count `primary`-filled elements per region. Read the background role of the key content group
  and of its surroundings in light and dark.
- **Pass:** At most one `primary`-filled element per region (heuristic); other emphasis steps down the
  ladder (`primary-container`, `tertiary-container`, `secondary-container`, a surface container, then
  `primary` text or an `outline` stroke); families are mixed rather than tinted; the key group sits on the
  brightest surface in both themes, which means `surface-bright` over `surface-container` or
  `surface-dim` (N98 over N94 in light, N24 over N12 in dark). `surface-bright` on a plain `surface` page
  adds nothing in light theme, where the two are the same value, so a full-screen grouped list gives its
  groups a `surface-container` region of their own.
- **Ref:** [color.md: Choosing roles for emphasis](color.md#choosing-roles-for-emphasis-the-expressive-color-tactic), [A grouped list screen](color.md#a-grouped-list-screen-settings)

#### COL-07 Target boundaries reach 3:1
**Major.** Can people see where each interactive control is?
- **Verify:** Measure each control's fill against the color behind it; where it is under 3:1, read its
  border or outline color. Check adjacent groups: button rows, segmented controls, chip rows, floating
  elements over content.
- **Pass:** A control whose fill is under 3:1 against its background has a boundary in `outline` (4.33:1 in
  light and 5.87:1 in dark against `surface`) or another role that reaches 3:1; `outline-variant` (1.62:1
  and 1.99:1) is never the only cue; clusters of adjacent tonal containers (1.21 to 2.04:1 against
  `surface` at standard contrast) get such a boundary or a fill that clears 3:1 (`primary` is 6.12:1). A
  standalone prominent element such as a FAB is exempt.
- **Ref:** [color.md: WCAG targets you still own](color.md#wcag-targets-you-still-own)

#### COL-08 Themes and contrast levels complete
**Major.** Are light and dark themes shipped at all three contrast levels, and can users reach them?
- **Verify:** Rendering › emulate `prefers-contrast: more` with no `data-contrast` set: baseline light
  `primary` changes from `#6750A4` to `#381E72`. Look for an in-app setting offering medium. In any
  generated or brand CSS, find `[data-contrast="medium"]`, `[data-contrast="high"]` and a
  `@media (prefers-contrast: more)` block.
- **Pass:** Both themes at standard, medium and high contrast; `prefers-contrast: more` selects high when
  the user hasn't chosen; an in-app setting reaches medium and can override the OS (for example a
  System, Standard, Medium, High choice where System removes `data-contrast`, not an on/off switch);
  every non-baseline scheme supplies its own medium and high values for every role, surfaces included;
  at high contrast, text-on-fill pairs reach about 7:1 (baseline: at least 7.20:1).
- **Ref:** [color.md: Contrast levels](color.md#contrast-levels), [Mapping levels to the web](color.md#mapping-levels-to-the-web), [Appearance settings](color.md#appearance-settings)

#### COL-09 No invented tones
**Major.** Are tints and shades taken from roles, not computed on the fly?
- **Verify:** Grep set, COL-09 line; review each `color-mix()` and each preprocessor color function.
- **Pass:** `color-mix()` appears only as an opacity layer over a role: state layers at the state
  opacities, disabled content at 38% (`--md-sys-state-disabled-state-layer-opacity`) and filled
  containers at 10% (`calc(var(--m3e-state-disabled-container-opacity) * 100%)`), the scrim at 32%, and
  the shadow layers at 30% and 15% where a subtree redeclares the shadow helpers (PRI-10); no lighter or
  darker variants of a role (`color-mix(in srgb, var(--md-sys-color-primary) 80%, white)`), and no HSL,
  OKLCH or Sass lightness steps standing in for tonal palettes. Such mixes have no contrast guarantee.
- **Ref:** [color.md: Derived colors with color-mix()](color.md#derived-colors-with-color-mix)

#### COL-10 Fixed roles only where theme-independent
**Minor.** Are `*-fixed` and `*-fixed-dim` roles used only where an element must look the same in both
themes?
- **Verify:** Grep set, COL-10 line; for each use, ask whether contrast with the surrounding surface
  carries meaning.
- **Pass:** Fixed roles appear only on elements meant to look identical in light and dark (baseline
  `primary-fixed` is `#EADDFF` in both at standard contrast), with `on-X-fixed` or `on-X-fixed-variant`
  content, and never where contrast with the surrounding surface matters.
- **Ref:** [color.md: Add-on roles: fixed and fixed-dim](color.md#add-on-roles-fixed-and-fixed-dim)

#### COL-11 Custom colors complete
**Major.** Does each custom color (success, warning, a data category) form a complete role group?
- **Verify:** For each group, find its four roles in every context block: standard (`:root`),
  `[data-contrast="medium"]`, `[data-contrast="high"]` and `@media (prefers-contrast: more)` on
  `:root:not([data-contrast])` (for a scheme scoped with `--selector`, the same blocks written against
  that selector). Compare tones with the recipe.
- **Pass:** Four roles (color, on-color, color-container, on-color-container) × light and dark × three
  contrast levels; tones follow the skill's recipe (standard light 40/100/90/30, dark 80/20/30/90; medium
  light 30/100/40/100, dark 90/10/60/0; high light 20/100/30/100, dark 95/0/80/0) or measure at least as
  well; a product prefix, never `--md-` or `--m3e-`; harmonized toward primary unless the color is literal
  (logo, brand mark, signage); no custom red that duplicates `error`. `scripts/generate-scheme.mjs --custom`
  passes as generated: it writes `--app-color-<name>`, `--app-color-on-<name>`,
  `--app-color-<name>-container` and `--app-color-on-<name>-container` with this recipe at all three
  levels.
- **Ref:** [color.md: Adding custom colors](color.md#adding-custom-colors-static-colors)

#### COL-12 Generated schemes
**Major.** Are generated or brand schemes built with the current Material Color Utilities API and loaded
in the right order?
- **Verify:** Read the generation code, the output CSS and the stylesheet order.
- **Pass:** Built with `DynamicScheme` classes (`SchemeTonalSpot`, `SchemeContent`, `SchemeFidelity` and
  so on) or `scripts/generate-scheme.mjs`, not `themeFromSourceColor()`/`applyTheme()` (tells: property
  names like `--md-ref-palette-primary-primary40`, 29 roles, no surface containers or fixed roles, tone-10
  on-containers, inline styles); every context block holds all 48 per-context roles at contrast levels 0,
  0.5 and 1; the output loads after `m3-expressive-tokens.css`; spec 2021, unless 2025 was chosen on
  purpose with a variant that implements it (tonal spot, neutral, vibrant or expressive).
- **Ref:** [color.md: Generating a scheme from a seed](color.md#generating-a-scheme-from-a-seed), [MCU color spec 2021 vs 2025](color.md#mcu-color-spec-2021-vs-2025)

#### COL-13 Content-based color scoped
**Minor.** Is color taken from an image confined to the region beside that image?
- **Verify:** Find the content scheme's selector and the image it came from.
- **Pass:** The scheme targets a region (such as `.player`), not `:root`; its source image is visible in or
  next to that region; at most two schemes from different source types on one screen; `error` and custom
  semantic roles are not overridden in that scope. N/A without content-based color.
- **Ref:** [color.md: Choosing a source](color.md#choosing-a-source)

#### COL-14 Baseline on-container tone
**Minor.** If the 3P baseline is used unmodified, are the light-theme on-container roles at tone 30?
- **Verify:** Under `data-theme="light" data-contrast="standard"`, read the computed color of elements
  using each `on-*-container` role.
- **Pass:** `on-primary-container` `#4F378B`, `on-secondary-container` `#4A4458`, `on-tertiary-container`
  `#633B48`, `on-error-container` `#8C1D18`; not the older tone-10 values `#21005D`, `#1D192B`, `#31111D`,
  `#410E0B`.
- **Ref:** [color.md: What M3 Expressive changed](color.md#what-m3-expressive-changed)

## Typography (TYP)

Reference: [typography.md](typography.md). Sizes are CSS px at the browser's default 16px root.

#### TYP-01 Every text style is on the scale
**Major.** Does every text element use one of the 30 styles at the active language height?
- **Verify:** Live: run T2 at the default font size; it groups text by size, line height, weight and
  letter spacing and marks combinations that match no style. Watch for native controls that don't inherit
  fonts (a `<button>` at 13.33px). Spec: every text layer bound to a type style.
- **Pass:** Sizes only 57, 45, 36, 32, 28, 24, 22, 16, 14, 12 and 11px; each element's line height, weight
  and tracking match a style (T2 holds the table; `letter-spacing: normal` counts as 0); the only
  exceptions are documented editorial tokens.
- **Ref:** [typography.md: Baseline values](typography.md#baseline-values)

#### TYP-02 Five longhands per role
**Major.** Is each role applied with all five of its properties?
- **Verify:** Grep set, TYP-02 line; role rules missing `letter-spacing`. Computed: body-large text shows
  `letter-spacing: 0.5px` with static Roboto.
- **Pass:** `font-family`, `font-weight`, `font-size`, `line-height` and `letter-spacing` all come from the
  role's `--md-sys-typescale-[emphasized-]<role>-*` tokens (or the same values); no `font` shorthand on role
  text (it can't carry tracking and resets numeric and axis settings); no role text falls back to
  `line-height: normal`.
- **Ref:** [typography.md: Apply a role](typography.md#2-apply-a-role-utility-classes)

#### TYP-03 Relative units, untouched root
**Major** (blocker when text can't be enlarged). Does text follow the user's font-size setting?
- **Verify:** Grep set, TYP-03 lines. Set the browser default font size to 32px and confirm text grows
  (A11Y-06 covers clipping).
- **Pass:** Font sizes and line heights in rem or em (the tokens are rem); no px or `62.5%` root font size;
  no font size in viewport units without a rem term (`clamp(2.5rem, 2rem + 3vw, 4rem)` passes, `5vw` alone
  fails WCAG technique F94).
- **Ref:** [typography.md: Accessibility](typography.md#accessibility)

#### TYP-04 Minimum size
**Major.** Is all text at least 11px?
- **Verify:** T2 lists every computed size.
- **Pass:** Nothing below 11px (0.6875rem, label-small), the smallest style on the scale.
- **Ref:** [typography.md: Accessibility](typography.md#accessibility)

#### TYP-05 Roles match purpose
**Major.** Is each role used for what it is meant for?
- **Verify:** Review text by element type (paragraphs, buttons, titles, labels, figures).
- **Pass:** Running text uses body; component text uses label; button labels scale with the button:
  label-large (baseline or emphasized) on small buttons, and a title or headline role allowed on larger
  Expressive buttons; app bar titles and section headers use title; headline opens major regions; display
  only on short text or numerals (one or two lines); no body style inside buttons; neighboring levels in
  use differ clearly in size (not 1–2px apart), and the product uses only as many styles as its content
  needs.
- **Ref:** [typography.md: Roles](typography.md#roles)

#### TYP-06 Emphasized styles rationed
**Major.** Are emphasized styles limited to states and moments that deserve them?
- **Verify:** Inventory elements on `--md-sys-typescale-emphasized-*` tokens (or heavier than their role's
  baseline weight); compare each with its baseline twin.
- **Pass:** Used on selected or current items, unread items, the primary action label, headlines, key
  figures and editorial moments only; not the default for body text, every list item or all navigation
  labels; each differs from its twin only in weight: 400 → 500 (display, headline, title-large, body) or
  500 → 700 (title-medium, title-small, label-*); emphasized label-medium and label-small (700 at 12 and
  11px) only for single meaningful states.
- **Ref:** [typography.md: Emphasized styles](typography.md#emphasized-styles)

#### TYP-07 Expressive faces stay large
**Major.** Are decorative or highly expressive typefaces kept to display and headline text?
- **Verify:** Compare the computed `font-family` of body, label and small title text with display and
  headline text.
- **Pass:** Decorative, script or handwritten faces appear only on display and headline roles (title-large
  with care); body and label text use the plain face.
- **Ref:** [typography.md: Roles](typography.md#roles)

#### TYP-08 Brand and plain mapping
**Minor.** Do typefaces map to roles the M3 way, and are they swapped at the right level?
- **Verify:** Compare computed families of title-large with title-medium and label text; find where
  `--md-ref-typeface-*` overrides are declared; check each stack's fallback loads or is installed.
- **Pass:** Brand serves display-*, headline-* and title-large; plain serves title-medium, title-small,
  body-* and label-*, for baseline and emphasized alike; product-wide swaps override
  `--md-ref-typeface-brand`/`--md-ref-typeface-plain` on `:root`, subtree swaps override the
  `--md-sys-typescale-*-font` tokens; stacks fall back through Roboto and Noto Sans (plus the script's Noto
  family for content outside Latin, Greek and Cyrillic).
- **Ref:** [typography.md: Brand and plain](typography.md#brand-and-plain)

#### TYP-09 Real weights loaded
**Major.** Is every weight in use backed by a loaded font face?
- **Verify:** Run T8; DevTools › Computed › Rendered Fonts; read the font request.
- **Pass:** Each family and weight in use is covered (400, 500 and 700 for static Roboto, or a variable
  range); no synthetic bold; `font-synthesis-weight: none` isn't hiding a missing weight (which would render
  an emphasized style at its baseline weight). Offline and single-file pages ship their faces with
  `@font-face` (self-hosted or inlined woff2): a fallback such as Arial has no 500, so baseline and
  emphasized styles render alike. Test them with the network off.
- **Ref:** [typography.md: Load the fonts](typography.md#1-load-the-fonts), [Self-hosted and offline fonts](typography.md#self-hosted-and-offline-fonts)

#### TYP-10 Variable-font axes
**Major.** Are axis settings made through the high-level properties?
- **Verify:** Grep set, TYP-10 line; computed `font-variation-settings` and `font-optical-sizing` on role
  elements.
- **Pass:** `font-variation-settings` holds only `GRAD` or parametric axes, never `wght`, `wdth`, `slnt` or
  `opsz` (they override `font-weight`, `font-stretch`, `font-style` and optical sizing, and a pinned
  `opsz` stops following the size); `font-optical-sizing` stays `auto`; with Roboto Flex,
  `font-variation-settings` is declared on the element whose variable changes (it inherits as a resolved
  value).
- **Ref:** [typography.md: Roboto Flex axes in CSS](typography.md#4-roboto-flex-axes-in-css)

#### TYP-11 Font request axes
**Minor.** Does the web font request include every axis the CSS relies on?
- **Verify:** Grep set, TYP-11 line; compare the `css2` URL (or `@font-face` ranges) with the CSS.
- **Pass:** Roboto Flex requests `opsz` (without it every size renders the 14px design), plus `GRAD` when
  grade is used and `wdth` (`25..151`) when `font-stretch` changes; never `ROND` (the API answers HTTP
  400); static Roboto requests `wght@400;500;700` or a covering range.
- **Ref:** [typography.md: Load the fonts](typography.md#1-load-the-fonts)

#### TYP-12 Variable context
**Minor.** When Roboto Flex is the scale's face, does it follow the variable context?
- **Verify:** With `data-typeface="variable"`, read computed `letter-spacing` of body-large and
  display-large text and the computed `font-family`.
- **Pass:** Tracking 0 for every role; the stack starts `"Roboto Flex", Roboto, "Noto Sans"`; weights as in
  the static scale. N/A with static Roboto.
- **Ref:** [typography.md: Variable-font tokens in the database](typography.md#variable-font-tokens-in-the-database)

#### TYP-13 Language height
**Major.** Is `<html lang>` set, and do taller scripts get taller line heights?
- **Verify:** Read `document.documentElement.lang`; on localized pages read computed line heights:
  body-medium 20px (small), 23px (medium, e.g. `ja`), 26px (large, `my`); body-large 24, 27, 31px.
- **Pass:** `lang` on `<html>` and on embedded runs in another language; Medium for am, ar, hy, bn, zh, gu,
  hi, ja, kn, km, ko, lo, ml, or, pa, si, ta, th and vi (automatic with the token file), for Medium-script
  languages the automatic list misses (fa, ur, ne, mr, ka need `data-language-height="medium"`), and as
  the blanket choice only when the language is unknown; Large for Burmese and Telugu; Extra large only
  with a Nastaliq face; Small for Latin (except Vietnamese), Greek, Cyrillic and Hebrew, including
  unlisted languages in those scripts; a block that mixes scripts takes its tallest script's category. An
  embedded run re-applies its role's line height, because inherited line heights are fixed lengths.
- **Ref:** [typography.md: Language height](typography.md#language-height)

#### TYP-14 Text boxes grow with their text
**Major.** Do text containers grow with taller line heights and larger text?
- **Verify:** Set `data-language-height="large"` (and `"extra-large"` if Nastaliq is supported) on
  `<html>`, then list clipped boxes:
  `[...document.querySelectorAll('body *')].filter((el) => /hidden|clip/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1)`.
  Intentional one-line truncation with the full text available elsewhere is fine.
- **Pass:** Text boxes use `min-block-size` plus padding, not fixed heights; nothing clips; display-large
  and display-medium text inside `overflow: hidden` boxes has block padding (their line boxes, 1.123 and
  1.156 times the size, are shorter than Roboto's content area at 1.172 times).
- **Ref:** [typography.md: Readability](typography.md#readability), [Language height](typography.md#language-height)

#### TYP-15 Weight changes don't shift layout
**Minor.** Does selecting a tab, chip or list item leave its neighbors where they were?
- **Verify:** Record the neighbors' `getBoundingClientRect()`, toggle `aria-selected`, `aria-pressed` or
  `aria-current`, and compare.
- **Pass:** No neighbor moves: width is reserved for the heavier weight (text widens about 1.4% per 100
  units of weight), or the state uses grade (`GRAD`), which never changes widths.
- **Ref:** [typography.md: Emphasized overrides](typography.md#3-emphasized-overrides)

#### TYP-16 Line length
**Minor.** Does body text run 40–60 characters per line at every width?
- **Verify:** At each class, and especially at 1700px, count the characters on a full line of body text;
  read `max-inline-size` on the element that carries the body role (`ch` follows that element's own font
  size).
- **Pass:** 40–60 characters per line, counted. The skill's cap is `max-inline-size: 50ch`: in Roboto
  body-large with its 0.5px tracking, 50ch measured 53–59 characters per line and 60ch measured 63–70,
  which is too many; 40 characters arrive at about 36ch. A different face, size or script passes on the
  counted characters, not on the `ch` value. Spare width at large and extra-large goes to margins, columns
  or a second pane.
- **Ref:** [typography.md: Readability](typography.md#readability), [layout.md: Line length](layout.md#line-length)

#### TYP-17 Tabular figures
**Minor.** Do tables, timers, clocks and counters keep their digits aligned?
- **Verify:** Read computed `font-variant-numeric`; render `1111` and `0000` in the element's font and
  compare their widths.
- **Pass:** Equal widths (Roboto and Roboto Flex default to tabular figures); no `proportional-nums` on
  such elements.
- **Ref:** [typography.md: Readability](typography.md#readability)

#### TYP-18 Case and editorial restraint
**Minor.** Is text left in its written case, and is editorial type rare?
- **Verify:** Grep set, TYP-18 line; review hero and editorial type.
- **Pass:** No `text-transform: uppercase` on roles; at most one or two editorial treatments per product,
  none on labels or purely informational text, no clashing treatments in one layout; fluid editorial sizes
  keep a rem floor and a rem term.
- **Ref:** [typography.md: Editorial treatments](typography.md#editorial-treatments)

## Shape (SHP)

Reference: [shape.md](shape.md).

#### SHP-01 Radii on the scale
**Major.** Is every corner radius a step of the M3 scale?
- **Verify:** Live: run T3. Screenshot: at CSS px scale, measure from a corner to where the curve meets the
  straight edge. Spec: corner values bound to variables.
- **Pass:** Every radius is 0, 4, 8, 12, 16, 20, 28, 32 or 48px, or full (half the shorter side);
  exceptions are documented custom values or optical-roundness results (SHP-08; for example 34px inside a
  48px parent with 14px padding).
- **Ref:** [shape.md: The ten styles](shape.md#the-ten-styles)

#### SHP-02 Radii from tokens, with units
**Major.** Do component radii come from the shape tokens?
- **Verify:** Grep set, SHP lines: radius declarations whose value starts with a number, and unitless zero
  shape tokens.
- **Pass:** Radii reference `--md-sys-shape-corner-*` or `--md-sys-shape-corner-value-*`, directly or
  through a component property (`--app-card-shape`); half-height lengths for animated or mixed full
  corners (`calc(var(--height) / 2)`) are fine; every radius override carries a unit (`0px`, not `0`, so
  `calc()` and `max()` keep working); remapping a step overrides both twins
  (`--md-sys-shape-corner-medium` and `--md-sys-shape-corner-value-medium`), since neither references the
  other.
- **Ref:** [shape.md: Corners with tokens](shape.md#corners-with-tokens)

#### SHP-03 Full means a stadium
**Major.** Do pill shapes have semicircular ends?
- **Verify:** T3 flags `50%` on non-square boxes. Visual: the ends are half circles, not half ellipses.
- **Pass:** `border-radius: 50%` only on squares (circles); pills use `--md-sys-shape-corner-full` (9999px)
  on all four corners or half the height in px.
- **Ref:** [shape.md: "Full"](shape.md#full)

#### SHP-04 No 9999px beside smaller radii
**Major.** Is `9999px` (or `calc(infinity * 1px)`) used only when all four corners are full?
- **Verify:** T3 flags mixed elements; grep set, SHP lines.
- **Pass:** No element combines 9999px with a smaller non-zero radius (CSS shrinks all radii by one factor,
  which turns the small corners square); asymmetric shapes with a full side use half the height in px
  (28px on a 56px element).
- **Ref:** [shape.md: "Full"](shape.md#full)

#### SHP-05 No animation to or from 9999px
**Major.** Do corner animations run between concrete lengths?
- **Verify:** Find transitions and keyframes on `border-radius` and the values they move between; play them
  at 10% in the Animations panel.
- **Pass:** Neither end of any radius transition or keyframe is 9999px, `calc(infinity * 1px)` or
  `--md-sys-shape-corner-full`; full is written as half the height (20px on a 40px button); corners change
  smoothly, without stalling and then snapping or flashing square.
- **Ref:** [shape.md: Full corners that survive mixing and animation](shape.md#full-corners-that-survive-mixing-and-animation)

#### SHP-06 Step matches size and density
**Minor.** Is each step chosen by the element's size, density and role, and applied consistently?
- **Verify:** Sort T3 output by element type and compare.
- **Pass:** Compact controls people tap (buttons, icon buttons, switches, slider handles, search bars) and
  badges are full; chips 8px; surfaces attached to a screen edge (app bars, navigation bars) 0, or a
  top/start/end preset that rounds only the free edge; menus, text fields, tooltips and snackbars 4–8px;
  cards and standard containers 12–16px; dialogs, sheets and pickers 28px; 32px and 48px only on hero
  surfaces with room around the content; every instance of a component shares one step unless a variant or
  state changes it. (A synthesis of Compose defaults; Material gives no procedure.)
- **Ref:** [shape.md: Choosing a step](shape.md#choosing-a-step)

#### SHP-07 Dense containers stay modest
**Minor.** Do text-heavy cards, tables and long lists avoid large corners?
- **Verify:** Inspect the radius of every text-heavy container.
- **Pass:** 12px (medium) or less at rest, never full; a state change such as a selected list item moving to
  16px is fine.
- **Ref:** [shape.md: Customizing](shape.md#customizing)

#### SHP-08 Optical nested radii
**Minor.** Does a rounded child inside a padded rounded parent use a smaller radius?
- **Verify:** For each such pair, compare the child's radius with the parent's radius minus the padding.
- **Pass:** Child radius ≈ max(0, parent radius − padding), within one scale step (28px parent with 16px
  padding → 12px child); never equal to the parent's radius when the padding is above 0. Grouped lists and
  segmented groups with no spec of their own pass on the skill's default: outer corners from this rule,
  inner corners extra-small (4px), items `space25` (2px) apart (Material publishes no values for them).
- **Ref:** [shape.md: Optical roundness](shape.md#optical-roundness-nested-radii), [Inner corners](shape.md#inner-corners-asymmetric-shapes)

#### SHP-09 Corners mirror in RTL
**Major.** Do start/end shapes and inner corners flip with the reading direction?
- **Verify:** Set `dir="rtl"` on `<html>` and compare; grep set, LAY-17 line (physical corner longhands),
  plus four-value `border-radius` shorthands that express start or end; any `:root` override of
  `--md-sys-shape-corner-large-start`/`-end` must be restated under `[dir="rtl"]` after it.
- **Pass:** Start/end shapes and inner corners use logical longhands (`border-start-start-radius` and so on)
  or the direction-aware presets, and all of them mirror. The shipped presets follow the `dir` attribute
  only, not CSS `direction` or `dir="auto"`.
- **Ref:** [shape.md: Logical corners and RTL](shape.md#logical-corners-and-rtl)

#### SHP-10 Library shapes in the right places
**Minor.** Are library shapes used on imagery, avatars, decoration, progress or one focal element only?
- **Verify:** Grep set, SHP-10 line; inspect what each shaped element holds.
- **Pass:** Never on text-heavy containers; scalloped and star shapes hold at most a number or a word; no
  shape implies a meaning it doesn't have (a heart reads as "favorite"; arrows and triangles read as icons).
- **Ref:** [shape.md: Where library shapes belong](shape.md#where-library-shapes-belong)

#### SHP-11 Abstract shapes restrained
**Minor.** Are abstract shapes few, uniform and well spaced?
- **Verify:** Review each screen; check the aspect ratio of every shaped element.
- **Pass:** Few per screen; repeated shapes share one form and size; space between shapes and data; no
  overlaps; shaped elements are 1:1 (`aspect-ratio: 1` or equal sides) unless stretching is deliberate;
  nearby text and icons hold still while a shape morphs.
- **Ref:** [shape.md: Principles](shape.md#principles-using-shape-expressively)

#### SHP-12 Clipped controls stay usable
**Blocker.** Do interactive elements with a clipped shape keep their focus ring and hit area?
- **Verify:** Tab to each shaped control; confirm `clip-path` or `mask` sits on a child layer, not on the
  focusable element; measure the unclipped element; click near the clipped-away corners.
- **Pass:** The focusable element is unclipped, at least `--m3e-min-target-size` (48px) in each
  direction, and shows a complete focus ring; a click anywhere in its 48px box activates it.
- **Ref:** [shape.md: Clipping caveats](shape.md#clipping-caveats)

#### SHP-13 Shadows on clipped shapes
**Minor.** Do elevated clipped shapes still show their shadow?
- **Verify:** Look for `box-shadow` on elements that also have `clip-path` or `mask` (the clip removes it);
  grep set, ELV-01 lines (the second lists hand-written `drop-shadow()` chains).
- **Pass:** The shadow comes from `filter: var(--m3e-elevation-drop-shadow-levelN)` on an unclipped parent:
  the level's two layers as `drop-shadow()` filters, which take no spread, so the ambient layer is a little
  tighter than the box-shadow version. A hand-written chain passes only if it matches a level (level 1:
  `drop-shadow(0 1px 2px …30%)` then `drop-shadow(0 1px 3px …15%)` of `--md-sys-color-shadow`).
- **Ref:** [shape.md: Clipping caveats](shape.md#clipping-caveats)

#### SHP-14 Library morphs interpolate
**Major.** Do shape-to-shape morphs animate smoothly?
- **Verify:** Slow the animation to 10% and scrub it; or pause `el.getAnimations()` at 25% and 75% and read
  `clip-path`: the command count stays constant and the numbers change continuously.
- **Pass:** Both ends come from one matched pair (a port of Compose's `Morph`); no snap at 50%; no twisting
  from an unmatched pair that merely has equal curve counts.
- **Ref:** [shape.md: Morphing on the web](shape.md#morphing-on-the-web)

#### SHP-15 Morphs have a purpose and a spatial spring
**Minor.** Does each morph communicate something, on a suitable spring?
- **Verify:** List each morph with its trigger and its transition or animation timing.
- **Pass:** Every morph shows an interaction or state, progress, or a change in the environment; morphs run
  on spatial helpers, with press, toggle and selection morphs on small and medium controls on
  `--m3e-motion-spring-fast-spatial` (the skill default) and larger surfaces on default or slow spatial by
  size (MOT-04). One alternative also passes: plain (non-toggle) button presses on
  `--m3e-motion-spring-default-effects`, Compose's calmer no-bounce choice, when the whole product uses it
  and its reduced-motion rule drops `border-radius` from the transition (effects helpers keep their timing
  there). Library-shape morphs stay in a few focal places.
- **Ref:** [shape.md: Shape morphing](shape.md#shape-morphing)

#### SHP-16 corner-shape as enhancement only
**Minor.** Is CSS `corner-shape` used only to add the cut family where supported?
- **Verify:** Grep set, SHP-16 line.
- **Pass:** Every use sits inside `@supports (corner-shape: bevel)`, uses `bevel`, and falls back to
  acceptable round corners; no `squircle` or `superellipse()` on the M3 scale; cut corners get padding of
  at least half the cut size.
- **Ref:** [shape.md: Cut corners and corner-shape](shape.md#cut-corners-and-corner-shape)

#### SHP-17 Round buttons square up when pressed
**Minor.** Do round buttons and icon buttons take a squarer shape while pressed, by their size, and spring back?
- **Verify:** Press and hold buttons of each size and kind (filled, tonal, outlined, text, icon) at 10% animation
  speed; read the computed `border-radius` at rest and while `:active`, and of the state-layer and ripple layers inside.
- **Pass:** At rest the radius is half the height as a length (or 50% on a square icon button), never `9999px` or
  `calc(infinity * 1px)`; pressed, it is about 8px at 40px tall, 12px at 56px and at most 16px
  ([shape.md: Pressed and selected shapes by size](shape.md#pressed-and-selected-shapes-by-size)); the change runs on
  the fast spatial spring (or default effects, SHP-15) and every inner layer and the focus ring take the same corners.
  FABs, joined-group segments and controls with their own deliberate press behavior are out of scope. Fail a button
  whose square flash at the start of the press shows a spring overshooting from a `9999px` rest.
- **Ref:** [shape.md: Pressed and selected shapes by size](shape.md#pressed-and-selected-shapes-by-size)

## Motion (MOT)

Reference: [motion.md](motion.md). Helpers are this skill's `--m3e-motion-spring-<speed>-<type>` web curves.

#### MOT-01 Motion values from tokens
**Major.** Does every transition, animation, `animate()` call and JS spring take its timing from motion
tokens or helpers?
- **Verify:** Live: run T7 in each state. Code: grep set, MOT-01 line.
- **Pass:** Durations and easings come from `--m3e-motion-spring-*` helpers, the legacy
  `--md-sys-motion-duration-*` and `--md-sys-motion-easing-*` tokens, or JS springs fed by
  `--md-sys-motion-spring-*-damping`/`-stiffness`; no `ease`, `ease-in-out`, bare `0.3s` or unexplained
  `cubic-bezier()`; no `transition: all`, so spatial and effects properties get their own curves. The
  reduced-motion value `1ms linear` is expected.
- **Ref:** [motion.md: Springs as CSS](motion.md#springs-as-css-official-curves-vs-linear-traces)

#### MOT-02 Effects never overshoot
**Major.** Are color, opacity, filter and shadow changes on non-overshooting curves?
- **Verify:** T7 flags effects properties on overshooting curves; grep set, MOT-02 line. Visual at 10%
  speed: a fade-out never reappears briefly and a color never flashes past its end value.
- **Pass:** `opacity`, `color`, `background-color`, `border-color`, `outline-color`, `fill`, `stroke`,
  `filter` and `box-shadow` use `*-effects` helpers or legacy easings: no `cubic-bezier()` y value above 1
  or below 0 and no `linear()` stop above 1 on those properties.
- **Ref:** [motion.md: Spatial and effects springs](motion.md#spatial-and-effects-springs)

#### MOT-03 Spatial properties follow the scheme
**Minor.** Do position, size, radius and clip changes use spatial springs?
- **Verify:** Read transitions on `transform`, `translate`, `scale`, `rotate`, `width`/`height`,
  `inline-size`/`block-size`, `inset`, `border-radius`, `clip-path` and `grid-template-rows`; switch
  `data-motion-scheme` to `standard` and back.
- **Pass:** They use `--m3e-motion-spring-<speed>-spatial` (or its `-linear` trace), so the scheme switch
  visibly removes and restores the bounce. Exceptions: navigation transitions (MOT-10), and plain
  (non-toggle) button press morphs on default effects when the product makes that choice everywhere
  (SHP-15).
- **Ref:** [motion.md: Spatial and effects springs](motion.md#spatial-and-effects-springs)

#### MOT-04 Speed matches size
**Minor.** Does each animation's speed fit the size of what moves or how far it travels?
- **Verify:** List animated elements with their helper speed and rendered size.
- **Pass:** Small parts (switches, buttons, chips, checkboxes, icon toggles, menus) and short moves on fast;
  partial-screen surfaces (sheets, an expanding rail, a card expanding) on default; full-screen changes and
  long travel on slow. Importance doesn't change the speed: a hero moment stands out through larger
  travel, a shape morph or the expressive scheme, not through a slow spring on a small element. Fail a
  full-screen panel on fast or a toggle on slow. Not graded, but recommended: the effects half of a paired
  change runs at the same speed as its spatial half, except button color and state-layer changes, which
  stay on fast effects (STA-13).
- **Ref:** [motion.md: Speed](motion.md#speed-fast-default-slow)

#### MOT-05 One motion scheme
**Major.** Is one motion scheme set for the whole product?
- **Verify:** Grep set, MOT-05 line; spring library configuration.
- **Pass:** One scheme on `<html>` (absent means expressive with the token file); subtree swaps only on a
  documented hero or utility region; no per-component bounce tuning; utilitarian products on standard
  (PRI-07).
- **Ref:** [motion.md: Motion schemes](motion.md#motion-schemes-expressive-and-standard)

#### MOT-06 Spring values exact
**Major.** Do values presented as M3 springs match the tokens and the official curves?
- **Verify:** Compare JS spring configs, CSS curves and design-spec motion values with the table.
- **Pass:** Every value matches the table; spring libraries that take a damping coefficient get
  c = 2·ζ·√k (expressive spatial fast/default/slow 33.94/31.19/22.63; standard 67.35/47.62/31.18; effects
  123.29/80.00/56.57); one helper family per product (official curves or `-linear` traces, not both); a
  custom scheme keeps effects at ζ 1 and stiffness ordered fast > default > slow.
- **Ref:** [motion.md: Spring token values](motion.md#spring-token-values), [Spring libraries](motion.md#8-spring-libraries)

| Spring | Expressive ζ / k | Standard ζ / k | Official curve, expressive | Official curve, standard | Trace duration, expressive / standard |
|---|---|---|---|---|---|
| fast spatial | 0.6 / 800 | 0.9 / 1400 | 350ms `cubic-bezier(0.42, 1.67, 0.21, 0.9)` | 350ms `cubic-bezier(0.27, 1.06, 0.18, 1)` | 360 / 230ms |
| default spatial | 0.8 / 380 | 0.9 / 700 | 500ms `cubic-bezier(0.38, 1.21, 0.22, 1)` | 500ms `cubic-bezier(0.27, 1.06, 0.18, 1)` | 440 / 320ms |
| slow spatial | 0.8 / 200 | 0.9 / 300 | 650ms `cubic-bezier(0.39, 1.29, 0.35, 0.98)` | 750ms `cubic-bezier(0.27, 1.06, 0.18, 1)` | 600 / 490ms |
| fast effects | 1 / 3800 | same | 150ms `cubic-bezier(0.31, 0.94, 0.34, 1)` | same | 150ms |
| default effects | 1 / 1600 | same | 200ms `cubic-bezier(0.34, 0.8, 0.34, 1)` | same | 240ms |
| slow effects | 1 / 800 | same | 300ms `cubic-bezier(0.34, 0.88, 0.34, 1)` | same | 330ms |

#### MOT-07 Interruptible motion uses a JS spring
**Major.** Do drags, flings, swipe-to-dismiss, predictive-back-style previews and rapidly re-toggled
controls keep their velocity?
- **Verify:** Toggle a control faster than it settles; drag and release mid-animation. Code: pointer-up
  handlers pass the release velocity to a spring instead of toggling a class that starts a CSS transition.
- **Pass:** Motion reverses or retargets smoothly with no restart or kink; the spring reads damping and
  stiffness from the element's tokens (so subtree schemes apply); a dragged element follows the pointer in
  real time.
- **Ref:** [motion.md: Interruptible and gesture-driven motion](motion.md#7-interruptible-and-gesture-driven-motion-a-js-spring)

#### MOT-08 linear() gated by @supports
**Major** (blocker when a supported browser throws or leaves the UI stuck). Is every `linear()` easing
behind a feature test with a cubic-bezier base?
- **Verify:** Grep set, MOT-08 line; confirm each hit sits inside
  `@supports (transition-timing-function: linear(0, 1))` (or the `animation-timing-function` form), and
  that JS checks `CSS.supports('transition-timing-function', 'linear(0, 1)')` before passing a trace to
  `animate()`.
- **Pass:** The base rule uses the official cubic-bezier helpers or legacy tokens; the `-linear` helpers and
  `--m3e-motion-easing-emphasized-linear` appear only inside the feature test. Without `linear()` support
  (before Chrome 113, Firefox 112, Safari 17.2) a `transition` holding it is dropped entirely and
  `animate()` throws.
- **Ref:** [motion.md: Upgrade to the linear() traces](motion.md#3-upgrade-to-the-linear-traces-where-supported)

#### MOT-09 Reduced motion
**Blocker.** Does `prefers-reduced-motion: reduce` remove spatial and decorative motion everywhere while
keeping state changes visible?
- **Verify:** Rendering › emulate `prefers-reduced-motion: reduce`; exercise every animation, navigation
  and hero moment. Code: grep set, MOT-09 line. The token file's reduced block only reaches the spatial
  `--m3e-motion-spring-*` helpers, so check that JS springs and `animate()` calls test
  `matchMedia('(prefers-reduced-motion: reduce)')`, and that transitions on legacy duration tokens or
  literal durations, `@keyframes` animations, `::view-transition-*` rules and press morphs built on an
  effects helper (the SHP-15 alternative) have their own reduced path.
- **Pass:** Slides and scales become fades or happen instantly; parallax, shape morphs, ripple growth and
  focus-ring animations don't play; JS springs jump to their target; View Transitions don't morph (the
  container jumps and contents cross-fade); short effects fades remain, so every state change is still
  visible.
- **Ref:** [motion.md: Reduced motion and restraint](motion.md#reduced-motion-and-restraint)

#### MOT-10 Navigation uses the legacy pairs
**Major.** Do screen-to-screen transitions use the easing-and-duration pairs, without bounce?
- **Verify:** Inspect route and page transition CSS, `::view-transition-*` rules and router animation
  settings.
- **Pass:** Emphasized 500ms for movement that begins and ends on screen, emphasized-decelerate 400ms to
  enter, emphasized-accelerate 200ms to exit; or, for small utility moves, standard 300ms,
  standard-decelerate 250ms, standard-accelerate 200ms (values in MOT-14); exits shorter than entrances; no
  spatial spring helper or overshooting curve on ordinary navigation; durations above 600ms only for
  ambient motion; a drawer that can come back exits on emphasized, not accelerate. The rule covers moving
  between screens; a component entering or leaving within one (a menu, a sheet) may use springs (MOT-13).
- **Ref:** [motion.md: Pairs and rules](motion.md#pairs-and-rules)

#### MOT-11 Transition pattern fits the relationship
**Major.** Does each navigation use the pattern that matches how its two views relate?
- **Verify:** Move between top-level destinations, from a list into a detail, between tabs or carousel
  pages, and open a card into its full view.
- **Pass:** Top level: the old screen fades out, then the new one fades in, with no slide. Forward and
  backward in a hierarchy: a horizontal slide following the platform. Lateral peers (tabs, carousels): the
  group slides together with no fade. Container transform only for hero expansions and shallow flows, not
  deep hierarchies or frequent utility navigation. Components use enter and exit (MOT-13). The same
  navigation uses the same transition everywhere.
- **Ref:** [motion.md: Transition patterns](motion.md#transition-patterns)

#### MOT-12 Clean fades
**Minor.** Does outgoing content finish fading before incoming content appears?
- **Verify:** Record transitions in the Animations panel at 10%; read `::view-transition-old` and
  `::view-transition-new` durations and delays.
- **Pass:** Old and new content don't sit at mid opacity together for long (any cross-fade is short and in
  the fast early part); sheets and dialogs aren't slowly faded over content; arriving content causes no
  layout shift or pop-in (skeletons fade to content).
- **Ref:** [motion.md: Transition patterns](motion.md#transition-patterns)

#### MOT-13 Enter and exit from the nearest edge
**Minor.** Do components appear along an axis from the edge they belong to?
- **Verify:** Open menus, snackbars, sheets and dialogs at 10% speed; look for `scale()` or `scale:` on
  entering surfaces.
- **Pass:** Components grow away from their nearest edge with an axis reveal (a top menu grows down, a
  bottom snackbar grows up); off-screen components slide in from their own edge; no uniform scale-up or
  z-axis pop in the default (Android-style) pattern.
- **Ref:** [motion.md: Transition patterns](motion.md#transition-patterns), [Enter and exit with @starting-style](motion.md#4-enter-and-exit-with-starting-style)

#### MOT-14 Emphasized easing labelled correctly
**Minor.** Are curves called "emphasized" really the emphasized tokens?
- **Verify:** Grep variable names and comments for `emphasized`; compare the values behind them.
- **Pass:** "Emphasized" is either `--md-sys-motion-easing-emphasized` (`cubic-bezier(0.2, 0, 0, 1)`, the
  standard curve on the web) or `--m3e-motion-easing-emphasized-linear` (the true two-segment curve, behind
  `@supports`); emphasized-decelerate is `cubic-bezier(0.05, 0.7, 0.1, 1)` and emphasized-accelerate
  `cubic-bezier(0.3, 0, 0.8, 0.15)`, not MDC-Android's `(0.1, 0.7, 0.1, 1)` and `(0.3, 0, 0.8, 0.2)`;
  standard-decelerate is `cubic-bezier(0, 0, 0, 1)` and standard-accelerate `cubic-bezier(0.3, 0, 1, 1)`;
  no hand-picked curve carries the name.
- **Ref:** [motion.md: Easing](motion.md#easing)

#### MOT-15 Scheme swaps reach every animation
**Minor.** Does a subtree `data-motion-scheme` change every animation inside it?
- **Verify:** Grep set, MOT-15 line. Set `data-motion-scheme="standard"` on a subtree and read computed
  `transition-timing-function` of elements inside it.
- **Pass:** No custom property on `:root` wraps a spring helper (it resolves there and ignores subtree
  schemes); helpers are referenced directly in each element's `transition`, or composed on the element
  itself.
- **Ref:** [motion.md: Choose and swap schemes](motion.md#1-choose-and-swap-schemes)

#### MOT-16 Overshoot never exposes a gap
**Minor.** Do edge-attached surfaces keep covering the screen edge during an expressive overshoot?
- **Verify:** Open bottom sheets, drawers and app bars at 10% speed in the expressive scheme; inspect each
  surface's `::after` (or `::before`) and its padding at the attached edge.
- **Pass:** No strip of underlying content appears at the edge. The surface's background continues past
  the edge through a pseudo-element in the surface's own color (`background-color: inherit`) or through
  padding that sits off-screen at rest. The largest overshoot is 9.48% of the travel (fast spatial), so an
  extension of 10% of the distance the surface moves covers it; `overflow` on the surface itself would clip
  the extension, so scroll an inner element. A solid `box-shadow` used as the extension fails ELV-01.
- **Ref:** [motion.md: Component transitions with the shorthands](motion.md#2-component-transitions-with-the-shorthands)

#### MOT-17 Every entrance has an exit
**Minor.** Does each element that animates in also animate out?
- **Verify:** Open and close every panel, sheet, drawer, rail, popover and conditionally rendered region at 10%
  speed.
- **Pass:** Closing plays the opening in reverse (or a shorter version of it): a panel that widens open narrows shut, a
  region that fades in fades out. Whatever replaces a leaving element doesn't jump or show beside it while it leaves.
  Fail an entrance animation with an instant removal.
- **Ref:** [motion.md: Enter and exit together](motion.md#11-enter-and-exit-together)

#### MOT-18 Frequent navigation switches in place
**Minor.** Do frequent navigations (section switches, selecting items in a list-detail layout) change content without
whole-pane transitions?
- **Verify:** Switch sections and select several list items in a row, quickly; look for View Transitions, router
  animations or keyframes on the content area or detail pane.
- **Pass:** Content switches in place; motion stays on what changed (an indicator, an arriving item, a panel growing
  from its rail). Pane-level transitions are kept for rare moves such as a container transform into a full-screen
  detail. Fail fades or slides of whole panes on every navigation, and transitions that hold up clicks while they run.
- **Ref:** [motion.md: Restraint in navigation](motion.md#restraint-in-navigation)

#### MOT-19 Only arrivals animate, once
**Minor.** In lists that animate new items, does the animation play only for items that arrive while the list is open,
and only once?
- **Verify:** Open the list (first load), scroll up to load older items, switch to another list, receive an item,
  then scroll it out of view and back.
- **Pass:** Only the received item animates, and only the first time; first loads, older pages and switched lists
  appear without it. In a virtualized list the rise uses the `translate` property (rows positioned with `transform`
  keep their place).
- **Ref:** [motion.md: Items arriving in a long or virtualized list](motion.md#12-items-arriving-in-a-long-or-virtualized-list)

## Elevation (ELV)

Reference: [elevation.md](elevation.md).

#### ELV-01 Shadows use the six levels
**Major.** Is every shadow one of the six elevation levels?
- **Verify:** Live: run T4. Code: grep set, ELV-01 line. Screenshot: compare shadow extent with the level
  geometry below.
- **Pass:** Each computed `box-shadow` is `none` or equals a level: key layer at 30% plus ambient layer at
  15% of `--md-sys-color-shadow` (`#000000`): level 1 `0 1px 2px 0` + `0 1px 3px 1px`; level 2
  `0 1px 2px 0` + `0 2px 6px 2px`; level 3 `0 1px 3px 0` + `0 4px 8px 3px`; level 4 `0 2px 3px 0` +
  `0 6px 10px 4px`; level 5 `0 4px 4px 0` + `0 8px 12px 6px`. Chromium serializes level 1 as
  `color(srgb 0 0 0 / 0.3) 0px 1px 2px 0px, color(srgb 0 0 0 / 0.15) 0px 1px 3px 1px`. Clipped shapes use
  the `--m3e-elevation-drop-shadow-level*` filters instead (SHP-13). No other `box-shadow` passes: a focus
  ring drawn with it fails here and in STA-04, and so does a solid zero-blur shadow that stretches a
  background past a screen edge (use a pseudo-element, MOT-16).
- **Ref:** [elevation.md: Shadows](elevation.md#shadows)

#### ELV-02 Nothing rests at level 4 or 5
**Major.** Is every element at rest at level 3 or below?
- **Verify:** Load with the pointer off the page and nothing dragged, then run T4; grep set, ELV-02 line
  (hits should sit only in `:hover`, drag and similar interaction rules).
- **Pass:** No element shows the level 4 or level 5 shadow at rest.
- **Ref:** [elevation.md: The six levels](elevation.md#the-six-levels)

#### ELV-03 Tone separates overlapping areas
**Major.** Do nested and overlapping containers differ in surface role?
- **Verify:** For each card, panel, sheet or field, compare its computed `background-color` with that of
  the nearest ancestor that paints one. Visual: apply the no-shadow probe from the toolkit and check that
  every edge stays visible. Scroll each pane that passes under an app bar, not only the window.
- **Pass:** Every overlapping pair resolves to different surface roles, so edges read without shadows; an
  app bar with content scrolling under it moves to a higher container role instead of gaining a shadow:
  `surface` → `surface-container` on a plain page, or one tier past the content region's role when that
  region already uses `surface-container` (to `surface-container-high` in color.md's settings screen). The
  scrolled state follows the element that actually scrolls, such as a pane with its own overflow.
- **Ref:** [elevation.md: Tone](elevation.md#tone-default), [color.md: A grouped list screen](color.md#a-grouped-list-screen-settings)

#### ELV-04 Resting shadows are justified
**Minor.** Does every element with a resting shadow need one?
- **Verify:** Classify each resting shadow T4 lists.
- **Pass:** Only floating components (FAB, extended FAB, menu, dialog), elevated variants (a
  `surface-container-low` fill plus level 1) and elements over a photo, map or pattern have a resting
  shadow; plain cards, bars and panes on plain backgrounds have none.
- **Ref:** [elevation.md: Choosing a method](elevation.md#choosing-a-method)

#### ELV-05 Default resting levels kept
**Minor.** Do components keep their default resting level?
- **Verify:** Compare each component's resting shadow and tone with the list below and its own spec.
- **Pass:** Level 3: FAB, extended FAB, modal dialogs, search, date and time pickers. Level 2: scrolled app
  bar, menu, navigation bar, rich tooltip, toolbar. Level 1: banner, modal bottom sheet, elevated button,
  elevated card, elevated chips, modal navigation drawer, modal side sheet. Level 0: the rest (app bar at
  rest, filled, tonal and outlined buttons, filled and outlined cards, chips, lists, tabs, navigation
  rail). A level describes position, not necessarily a visible shadow (a navigation bar at level 2 is
  painted with tone); no component is raised to make it stand out.
- **Ref:** [elevation.md: Component resting levels](elevation.md#component-resting-levels-examples-only)

#### ELV-06 No surface tint
**Major.** Is the deprecated tint overlay gone?
- **Verify:** Grep set, ELV-06 line; look for primary mixed into surfaces at about 5, 8, 11, 12 or 14%
  (the old overlay was 5.12%, 8.24%, 10.76%, 11.89% and 13.54% at levels 1–5).
- **Pass:** No `--md-sys-color-surface-tint` in new code and no port of the overlay formula; tinted surfaces
  migrated (+1 → `surface-container-low`, +2 → `surface-container`, +3 → `surface-container-high`, +4 and
  +5 → `surface-container-highest`); tint never combined with the container roles.
- **Ref:** [elevation.md: Surface tint is deprecated](elevation.md#surface-tint-is-deprecated)

#### ELV-07 Hover lifts one level
**Minor.** Does hover raise elevated elements exactly one level, the same way for every element of a type?
- **Verify:** Hover each instance and compare its shadow with the next level up; confirm the `:hover` rules
  sit inside `@media (hover: hover)` and that `:focus` and `:active` rules don't change `box-shadow`.
- **Pass:** Rest → rest + 1 on hover (filled or tonal button 0 → 1, elevated button and card 1 → 2, FAB
  3 → 4); focus and press keep the resting level unless the product documents otherwise; every instance
  of a type behaves alike.
- **Ref:** [elevation.md: Resting and interaction levels](elevation.md#resting-and-interaction-levels)

#### ELV-08 Drag lift
**Minor.** Do dragged items lift consistently, and only items that may move?
- **Verify:** Find the dragging-state rules (`[data-dragging]`, `.is-dragging` or a library class) and
  compare them with the resting level.
- **Pass:** Dragged elements rise 3 levels, capped at 5; chips and list items go to level 4 per their
  component tokens (filled card 0 → 3, elevated card 1 → 4); every element of a type lifts the same way;
  fixed-position elements such as app bars never take a drag state. N/A without drag.
- **Ref:** [elevation.md: Where sources disagree](elevation.md#where-sources-disagree)

#### ELV-09 Disabled drops to level 0
**Minor.** Do disabled elevated elements lose their elevation?
- **Verify:** Inspect disabled and `aria-disabled` elevated buttons and cards; hover them.
- **Pass:** Computed `box-shadow` is `none` (level 0), declared after the hover rule so a hovered disabled
  element can't lift, unless the component's own spec keeps it (Material Web's elevated card stays at 1).
- **Ref:** [elevation.md: Where sources disagree](elevation.md#where-sources-disagree)

#### ELV-10 Scrim at 32%
**Major.** Does every modal layer sit over a 32% black scrim?
- **Verify:** Open each modal dialog, modal sheet, modal drawer and expanded navigation; read the computed
  background of its `::backdrop` or scrim element.
- **Pass:** `color(srgb 0 0 0 / 0.32)` or `rgba(0, 0, 0, 0.32)` (`--m3e-scrim`), or `#000000` at
  `opacity: 0.32` (`--m3e-scrim-opacity`); no tint, blur or second layer; directly behind the modal layer.
  Optional behind a floating pane on large screens. A subtree that overrides `--md-sys-color-scrim` also
  redeclares `--m3e-scrim` (PRI-10).
- **Ref:** [elevation.md: Scrims](elevation.md#scrims)

#### ELV-11 Dark theme separates by tone
**Major.** In dark theme, do elevated surfaces stay distinct without their shadows?
- **Verify:** Set `data-theme="dark"`, apply the no-shadow probe, and review every card, sheet, menu and
  dialog.
- **Pass:** Each still separates through its container role (dark containers get lighter with emphasis,
  from `surface` `#141218` up to `surface-container-highest` `#36343B`); no surface relies on a black
  shadow alone.
- **Ref:** [elevation.md: Dark theme](elevation.md#6-dark-theme)

#### ELV-12 Elevation changes use effects timing
**Minor.** Do elevation changes animate as effects, without moving the element?
- **Verify:** Read transitions that include `box-shadow`, `background-color` for lift, or `filter`; look for
  `transform`, `translate` or `scale` in the same hover or drag rules.
- **Pass:** Effects helpers (skill default `--m3e-motion-spring-fast-effects`, 150ms
  `cubic-bezier(0.31, 0.94, 0.34, 1)`; `-default-effects` for large tonal changes); no `translateY`,
  `translate` or `scale` accompanies a lift.
- **Ref:** [elevation.md: Transitions](elevation.md#3-transitions)

#### ELV-13 Level tokens are not paint
**Minor.** Are the level distance tokens kept out of shadow values?
- **Verify:** Grep set, ELV-13 line.
- **Pass:** `--md-sys-elevation-level0` to `level5` (0, 1, 3, 6, 8, 12px distances) never feed `box-shadow`,
  `filter` or Material Web's `--md-elevation-level`, which takes the index 0–5.
- **Ref:** [elevation.md: Material Web and clipped shapes](elevation.md#9-material-web-and-clipped-shapes)

## Interaction states (STA)

Reference: [interaction-states.md](interaction-states.md).

#### STA-01 Hover, focus and press feedback
**Major.** Does every interactive element respond visibly to hover (with a pointer), keyboard focus and
press, and every disabled element to none of them?
- **Verify:** Hover, Tab to and press each control. Code: state rules exclude `:disabled` and
  `[aria-disabled="true"]` (browsers match `:hover` on disabled buttons). Hover a disabled button and read
  `getComputedStyle(el, '::before').opacity` (or wherever the layer lives): it stays 0.
- **Pass:** A distinct hover, focus and pressed treatment on every actionable element; none on disabled
  ones; a cursor resting on an element with a tooltip also opens the tooltip.
- **Ref:** [interaction-states.md: The six states](interaction-states.md#the-six-states)

#### STA-02 State-layer opacities
**Major.** Are state layers at the token opacities?
- **Verify:** Grep set, STA-02 line; force each state in DevTools (`:hover`, `:focus-visible`, `:active`)
  and read the layer's computed opacity.
- **Pass:** Hover 0.08, focus 0.1, pressed 0.1, dragged 0.16 (`--md-sys-state-*-state-layer-opacity`);
  no 0.12 (the value from before September 2023, still in stable Material Web); no black or white
  overlays, brightness filters or per-component opacities.
- **Ref:** [interaction-states.md: State tokens](interaction-states.md#state-tokens)

#### STA-03 State-layer color, order and count
**Major.** Is the layer the content color, painted between container and content, one at a time?
- **Verify:** Inspect the layer element (often `::before`): its color, its stacking below the label (for
  example `z-index: -1` inside an `isolation: isolate` host), label and icon colors while hovered, and the
  opacity while hovered and focused together.
- **Pass:** The layer uses the content color (`on-primary` over `primary`, `on-secondary-container` over
  `secondary-container`, `on-surface-variant` over an unselected `surface-container` toggle); content stays
  at full strength above it; one layer per element, ranked dragged > pressed > focused > hovered (a press
  ripple over the hover tint for the length of the press is the one tolerated overlap); full-element layers
  follow the element's shape; small controls (checkbox, radio, switch handle) show a circular layer of
  `--m3e-state-layer-size` (40px) centred in the `--m3e-min-target-size` (48px) target.
- **Ref:** [interaction-states.md: State layers](interaction-states.md#state-layers), [Combining states](interaction-states.md#combining-states)

#### STA-04 Focus ring geometry
**Blocker** when focus is missing or invisible; **major** when a visible ring has other geometry. Does
keyboard focus show a ring built to the focus-indicator tokens?
- **Verify:** Tab through every focusable element; read computed `outline-width`, `outline-offset` and
  `outline-color` on the part that shows the ring; click a button with the mouse; grep set, STA-04 lines,
  pairing each `outline: none` with the replacement ring it relies on.
- **Pass:** A ring for every focusable element, drawn with `outline`: 3px, in the `secondary` role
  (`--m3e-focus-indicator-color`), `outline-offset` 2px outside the edge, or -3px inside only where the
  outside is clipped; follows the corners; shown on `:focus-visible` only (no ring after a mouse click on a
  button); no `box-shadow` rings, which forced colors removes. `outline: none` passes only on a native
  input whose visible part carries the ring instead: a range thumb (`::-webkit-slider-thumb` and
  `::-moz-range-thumb`), a row label that wraps a switch or checkbox (ring through
  `:has(input:focus-visible)`), or the segment whose visually hidden radio has focus. Any other
  `outline: none` fails.
- **Ref:** [interaction-states.md: Focus indicator](interaction-states.md#focus-indicator), [Focus ring](interaction-states.md#2-focus-ring), [Native inputs](interaction-states.md#11-native-inputs-ring-on-the-visible-part)

#### STA-05 Focus ring contrast and placement
**Major.** Does the ring stand out from what it sits on?
- **Verify:** Measure the ring color against the adjacent color in light and dark at all contrast levels;
  find inner rings and check the fill under them; check ancestors that clip (`overflow: hidden` or `auto`,
  `clip-path`).
- **Pass:** At least 3:1 against the adjacent color (the baseline outer ring measures at least 4.61:1 on
  every surface role in all six contexts); no inner ring on a `primary` or `secondary` fill (about 1:1
  there); clipping ancestors leave at least 5px around outer rings, or those items use the inner ring; a
  re-themed subtree sets `--m3e-focus-indicator-color` itself.
- **Ref:** [interaction-states.md: Focus indicator](interaction-states.md#focus-indicator)

#### STA-06 Disabled treatment
**Major.** Are disabled elements dimmed per part, flat and inert?
- **Verify:** Inspect disabled controls (computed `color` and `background-color` alpha, `box-shadow`); Tab
  through the page; grep set, STA-06 line.
- **Pass:** Content `on-surface` at 38% (`--md-sys-state-disabled-state-layer-opacity`); filled containers
  `on-surface` at 10% (`--m3e-state-disabled-container-opacity`, written
  `calc(var(--m3e-state-disabled-container-opacity) * 100%)` inside `color-mix()`; 12% only to match an
  older component set, one choice per product); level 0; no state layers; natively disabled controls
  skipped by Tab; dimming done per part with `color-mix()`, not element `opacity`; no hand cursor.
  Disabled content is exempt from contrast minimums.
- **Ref:** [interaction-states.md: Disabled](interaction-states.md#disabled)

#### STA-07 aria-disabled blocks activation
**Major.** Do elements with `aria-disabled="true"` stay discoverable but inert?
- **Verify:** Click each and press Enter and Space on it (a link's URL or the route must not change); Tab to
  it; grep set, STA-06 line (`pointer-events: none` on disabled selectors).
- **Pass:** No activation by pointer or keyboard (script blocks it); the focus ring still shows, without a
  focus layer; disabling never relies on `pointer-events: none`, which leaves keyboard activation working
  and blocks the tooltip that explains the state.
- **Ref:** [interaction-states.md: Disabled and aria-disabled](interaction-states.md#4-disabled-and-aria-disabled)

#### STA-08 No disabled FAB
**Minor.** Is an unavailable FAB removed rather than disabled?
- **Verify:** Search templates for a FAB with `disabled` or `aria-disabled`; walk flows where its action is
  unavailable.
- **Pass:** No disabled FAB anywhere; the FAB is absent while its action is unavailable.
- **Ref:** [interaction-states.md: Which elements take which states](interaction-states.md#which-elements-take-which-states)

#### STA-09 Containers stay quiet
**Minor.** Do containers stay untinted while their actionable children take states?
- **Verify:** Hover and press on the backgrounds of app bars, navigation, sheets, dialogs and menus. Hover a
  button inside a clickable card and read the card's layer opacity.
- **Pass:** App bars, navigation bars, rails and drawers, sheets, dialogs and menus don't tint as a whole;
  their items do; with a button inside a clickable card, only the button shows hover and press (the card's
  layer stays at 0, for example through a `:has()` guard); at most one hovered, focused, pressed and dragged
  element on screen.
- **Ref:** [interaction-states.md: Nested interactive elements](interaction-states.md#8-nested-interactive-elements)

#### STA-10 Selection is semantic and not hue-only
**Major.** Is every selected or current item marked by more than hue and exposed to assistive technology?
- **Verify:** Emulate achromatopsia (Rendering › Emulate vision deficiencies) and forced colors; toggle
  selections and watch the ARIA attributes; count `[aria-current="page"]` per navigation landmark; for
  states shown by shape, look for a second cue.
- **Pass:** A check mark, active indicator, shape change or weight change accompanies every color change,
  and a shape change is never the only cue either; `aria-selected`, `aria-pressed`, `aria-checked` or
  `aria-current` toggles with the visuals, and styles key off those attributes; exactly one active item
  per navigation set.
- **Ref:** [interaction-states.md: Selection](interaction-states.md#selection)

#### STA-11 Hover gated to hover-capable pointers
**Minor.** Do hover styles apply only where a pointer can hover?
- **Verify:** Grep set, STA-11 line; tap controls with touch emulation on.
- **Pass:** `:hover` state layers and lifts sit inside `@media (hover: hover)` (or `any-hover` by
  deliberate choice); no tint stays behind after a tap.
- **Ref:** [interaction-states.md: State layer](interaction-states.md#1-state-layer)

#### STA-12 Keyboard shows the pressed state
**Minor.** Does holding Enter or Space show the pressed state, as a click does?
- **Verify:** Focus a button and hold Enter, then Space.
- **Pass:** The pressed layer (or a ripple from the centre) appears at 0.1 while the key is down.
- **Ref:** [interaction-states.md: JS helpers](interaction-states.md#10-js-helpers)

#### STA-13 State timing and press morphs
**Minor.** Do state changes use the right springs, and do press and selection morphs move along the scale?
- **Verify:** Read the transitions on stateful components; press and select each at 10% speed.
- **Pass:** Layer fades and color changes, button colors included, on `--m3e-motion-spring-fast-effects`
  (150ms `cubic-bezier(0.31, 0.94, 0.34, 1)`); press, toggle and selection shape changes on small and
  medium controls on `--m3e-motion-spring-fast-spatial`, the skill default (plain press morphs on default
  effects pass under SHP-15's conditions); a state moves the shape along the corner scale, away from where
  it starts: round shapes get squarer when pressed, square ones rounder when selected, and a joined group's
  inner corners may move either way while its outer corners stay; both ends are concrete lengths
  (SHP-05). Illustrative (component value): a 40px round button squares from 20px to 8px while pressed.
  Per-size values belong to the component pages (https://m3.material.io/components), not to this check.
- **Ref:** [interaction-states.md: Expressing state with shape and springs](interaction-states.md#expressing-state-with-shape-and-springs), [shape.md: State through shape](shape.md#state-through-shape)

#### STA-14 Accessible drag and drop
**Major.** Can items be moved without a pointer, and is the move announced?
- **Verify:** Grep set, STA-14 line; reorder an item with the keyboard only and listen with a screen reader.
- **Pass:** No `aria-grabbed` or `aria-dropeffect` (deprecated); pick-up, moves and drops announced through
  a live region; a keyboard way to reorder (menu actions, or Space to pick up and arrows to move);
  `touch-action: none` only on drag handles, never on items that fill a scrolling list; long-press drag is
  not also used for range selection. N/A without drag.
- **Ref:** [interaction-states.md: Elevation and drag](interaction-states.md#5-elevation-and-drag)

#### STA-15 Hover-revealed controls
**Minor.** Are controls revealed on hover also available to keyboard and touch users?
- **Verify:** Tab into rows whose checkboxes or actions appear on hover; view them with touch emulation.
- **Pass:** They also appear on `:focus-within`; while hidden they stay reachable by Tab (hidden with
  opacity, not `display: none`); they are always visible on touch (`hover: none`); all selection checkboxes
  show once one item is selected.
- **Ref:** [interaction-states.md: Selection and shape morph](interaction-states.md#6-selection-and-shape-morph)

## Accessibility cross-checks (A11Y)

These apply to every audit, whatever the foundations in scope. Accessibility checks that belong to one
foundation live in its section: COL-02, COL-04, COL-07, COL-08, TYP-03, TYP-04, TYP-13, TYP-14, LAY-09,
LAY-12, LAY-15, LAY-17, SHP-12, MOT-09, STA-01, STA-04, STA-05, STA-06, STA-07, STA-10 and STA-14. A full
accessibility pass runs those too.

#### A11Y-01 Text contrast in all six contexts
**Blocker.** Does all text meet WCAG contrast in light and dark at standard, medium and high contrast?
- **Verify:** Run T1 in each of the six contexts. Measure text over images and gradients by hand. Confirm
  with axe or Lighthouse. Screenshot: sample the darkest stroke pixel of the text and the flat background
  beside it.
- **Pass:** At least 4.5:1; 3:1 only for large text, which is 24px regular or 18.67px bold (so title-large
  at 22px and smaller need 4.5:1, and headline-small at 24px qualifies); measured against the real
  background, including on-role text on its container and text inside theme islands. Disabled text is
  exempt.
- **Ref:** [color.md: WCAG targets you still own](color.md#wcag-targets-you-still-own), [typography.md: Accessibility](typography.md#accessibility)

#### A11Y-02 Non-text contrast
**Blocker.** Do meaningful graphics reach 3:1 against their surroundings?
- **Verify:** Measure icons that carry meaning, slider and progress tracks, selection marks (check, radio
  dot, switch handle), chart marks, input borders and focus rings against the adjacent colors, in all six
  contexts.
- **Pass:** At least 3:1 from standard contrast up; decorative graphics are exempt. Target boundaries are
  covered by COL-07, focus rings by STA-05.
- **Ref:** [color.md: WCAG targets you still own](color.md#wcag-targets-you-still-own)

#### A11Y-03 Target size and spacing
**Blocker** below 24×24px; **major** below the M3 size. Is every target large enough and far enough from
its neighbors?
- **Verify:** Run T5 at each width (it probes the real hit area with `elementFromPoint`, so pseudo-element
  hit areas count) and review the gaps. For each container T5 lists as tiled, confirm that it is one
  list, segmented control or connected group. Spec: target redlines.
- **Pass:** Touch targets at least 48×48px (`--m3e-min-target-size`), pointer-only products at least
  44×44px, with at least 8px between separate targets. Targets that sit edge to edge and tile one
  container without overlapping (list rows, segments, connected button groups, including the 2px gap of
  a grouped list) need no gap, as WCAG 2.5.8's spacing exception allows, but each one still reaches the
  full size. The visible part can be smaller (a 24px icon or a 32px button keeps a 48px hit area). Below
  24×24px fails WCAG 2.5.8. Inline links in running text are exempt.
- **Ref:** [interaction-states.md: Touch targets](interaction-states.md#touch-targets)

#### A11Y-04 Keyboard access and focus order
**Blocker.** Can everything be reached and operated by keyboard, in a sensible order?
- **Verify:** Put the mouse away: Tab and Shift+Tab through each screen in LTR and RTL; operate composite
  widgets with the arrow keys; press Enter, Space and Escape. Grep set, A11Y-04 line.
- **Pass:** Every interactive element reachable and operable; Tab order follows reading order (DOM order
  equals visual order; no positive `tabindex`; panes in reading order, mirrored in RTL); Tab moves between
  components and arrows within them; Enter activates, Space activates buttons and checkboxes; Escape closes
  menus, dialogs and sheets; each screen has a defined initial focus; closed drawers, collapsed panes and
  other hidden content are out of the tab order.
- **Ref:** [interaction-states.md: Focus order and keyboard](interaction-states.md#focus-order-and-keyboard), [layout.md: Pane focus and accessibility](layout.md#pane-focus-and-accessibility)

#### A11Y-05 Modal layers manage focus
**Blocker.** Do modal dialogs, sheets, drawers and floating panes hold focus and give it back?
- **Verify:** Open each by keyboard; Tab repeatedly; press Escape; read `document.activeElement` after it
  closes; check for `dialog.showModal()` or `inert` on the content behind; click the scrim.
- **Pass:** The content behind is inert to pointer and keyboard; focus moves into the layer on open and
  stays inside; Escape closes it; focus returns to the trigger (or to the next logical element if the layer
  opened by itself); a click on the scrim or outside dismisses it where the pattern allows; covered or
  off-screen panes are `inert`.
- **Ref:** [layout.md: Levitating panes](layout.md#levitating-panes), [elevation.md: Scrims](elevation.md#4-scrims)

#### A11Y-06 Text resize, spacing and reflow
**Blocker.** Does the UI survive enlarged text, wider text spacing and a narrow reflow?
- **Verify:** Browser default font size 32px (200%), then page zoom 200%; the text-spacing probe from the
  toolkit; 400% zoom on a 1280px-wide window (320 CSS px); the clipping scan from TYP-14; look for overlaps.
- **Pass:** Nothing clipped, overlapping or lost at 200% text size; with line height 1.5×, paragraph
  spacing 2×, letter spacing 0.12× and word spacing 0.16× of the font size nothing clips (WCAG 1.4.12); at
  320 CSS px content reflows to one column without horizontal scrolling, except content that needs two
  dimensions such as tables and maps (WCAG 1.4.10).
- **Ref:** [typography.md: Accessibility](typography.md#accessibility)

#### A11Y-07 Forced colors
**Major.** Does the UI keep its structure in forced-colors mode?
- **Verify:** Rendering › emulate `forced-colors: active` (or a Windows contrast theme); tab through,
  select and disable items; open dialogs and menus.
- **Pass:** Control boundaries, the edges of floating surfaces (dialogs, menus, FABs, elevated cards),
  selected and current states, focus rings and disabled states all stay visible: a transparent 1px border
  on containers and controls (painted in a system color there), outlines rather than `box-shadow` rings,
  selection in `Highlight`/`HighlightText` or with a check mark, disabled text in `GrayText`;
  `forced-color-adjust: none` only where the color is the content (swatches), never to keep shadows.
- **Ref:** [color.md: prefers-color-scheme, prefers-contrast, forced-colors](color.md#prefers-color-scheme-prefers-contrast-forced-colors), [elevation.md: Forced colors](elevation.md#7-forced-colors-windows-high-contrast), [interaction-states.md: Forced colors](interaction-states.md#9-forced-colors)

#### A11Y-08 Meaning never rides on one channel
**Major.** Is information conveyed by more than color, shape or motion alone?
- **Verify:** Grayscale emulation; reduced motion on; review links in running text, errors, status
  indicators and charts.
- **Pass:** Links in running text are underlined (colored `primary`, or `tertiary` for less prominence);
  errors pair the `error` color with an icon or text; statuses and chart series carry labels or patterns;
  a change that animates also changes color, shape or text. Selection is STA-10.
- **Ref:** [typography.md: Readability](typography.md#readability), [motion.md: Reduced motion and restraint](motion.md#reduced-motion-and-restraint)

#### A11Y-09 Auto-playing motion can be paused
**Blocker.** Can people stop motion that runs on its own?
- **Verify:** Wait on each screen for 5 seconds; list carousels, auto-advancing content and ambient
  animation.
- **Pass:** Anything that moves, blinks or advances by itself for more than 5 seconds has a pause or stop
  control (WCAG 2.2.2). Motion triggered by interaction can be turned off unless it is essential (WCAG
  2.3.3, AAA; MOT-09 covers the reduced-motion path).
- **Ref:** [motion.md: Reduced motion and restraint](motion.md#reduced-motion-and-restraint)

#### A11Y-10 Language and structure
**Major.** Is the page's language and structure exposed?
- **Verify:** Read `<html lang>`; list headings and landmarks (Accessibility pane or a screen reader's
  rotor); compare DOM order with visual order.
- **Pass:** `lang` on `<html>` and on embedded runs in another language; semantic elements; DOM order equals
  reading order; one `h1` and no skipped heading levels; one `main`, `banner` and `contentinfo`; repeated
  landmarks labelled (two `nav` elements with distinct `aria-label`s); icon-only controls named without
  role words.
- **Ref:** [expressive-principles.md: Accessibility is the baseline](expressive-principles.md#accessibility-is-the-baseline)

## Audit toolkit

### Grep set

For source audits. Needs [ripgrep](https://github.com/BurntSushi/ripgrep) and bash. Every hit is a
candidate for review, not an automatic failure: `#add` in a URL is not a color, and `0.12` may be a
duration.

```sh
# Run from the project root in bash. Point SRC at the style, markup and script sources, and
# TOKENS at the token file. X keeps the shipped token and shape files out of the results.
SRC=src
TOKENS=src/m3-expressive-tokens.css
X=(--glob '!**/m3-expressive-tokens.css' --glob '!**/material-shapes.css')

# PRI-08 reference tokens read by components
rg -n "${X[@]}" 'var\(--md-ref-' $SRC
# PRI-09 theme-scoped component rules
rg -n "${X[@]}" -e '\.dark\b' -e '\[data-theme' -e 'prefers-color-scheme' -e 'prefers-contrast' $SRC
# PRI-11 --md-* and --m3e-* names the product declares that the token file does not define
comm -23 <(rg -o -N --no-filename "${X[@]}" -r '$1' '(--(?:md|m3e)-[a-z0-9-]+)\s*:' $SRC | sort -u) \
         <(rg -o -N --no-filename -r '$1' '(--(?:md|m3e)-[a-z0-9-]+)\s*:' "$TOKENS" | sort -u)

# COL-01 literal colors and palette reads
rg -n "${X[@]}" -e '#[0-9a-fA-F]{3,8}\b' -e '\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(' -e 'var\(--md-ref-palette-' $SRC
# COL-03 container roles used as foreground or stroke
rg -n "${X[@]}" '(^|[^-])(color|fill|stroke|border(-[a-z]+)*-color|outline-color)\s*:\s*var\(--md-sys-color-(primary|secondary|tertiary|error)-container\)' $SRC
# COL-05 legacy roles
rg -n "${X[@]}" -e '--md-sys-color-(background|on-background|surface-variant)\b' $SRC
# COL-09 computed tints and shades
rg -n "${X[@]}" -e 'color-mix\(' -e '\b(lighten|darken|saturate|desaturate|scale-color|adjust-color|tint|shade)\(' -e 'color\.(adjust|scale|mix)\(' $SRC
# COL-10 fixed roles
rg -n "${X[@]}" 'color-(on-)?(primary|secondary|tertiary)-fixed' $SRC

# TYP-02 font shorthand and normal line height
rg -n "${X[@]}" -e '(^|[\s;{])font\s*:' -e 'line-height\s*:\s*normal' $SRC
# TYP-03 px or viewport font sizes; root font size
rg -n "${X[@]}" 'font-size\s*:[^;]*\b[0-9.]+(px|vw|vh|vmin|vmax)\b' $SRC
rg -n -U "${X[@]}" '(html|:root)\s*\{[^}]*font-size' $SRC
# TYP-10 axes that belong to high-level properties
rg -n "${X[@]}" -e 'font-variation-settings[^;]*\b(wght|wdth|slnt|opsz)\b' -e 'font-optical-sizing\s*:\s*none' $SRC
# TYP-11 Google Fonts requests
rg -n -o "${X[@]}" 'fonts\.googleapis\.com/css2[^">)\s]*' $SRC
# TYP-18 forced capitals
rg -n "${X[@]}" 'text-transform\s*:\s*uppercase' $SRC

# LAY-01 breakpoints in CSS and JS (T6 lists them from the live page)
rg -n "${X[@]}" -e '@(media|container)[^{]*[0-9]' -e 'matchMedia\(' $SRC
# LAY-09 safe areas
rg -n "${X[@]}" -e 'viewport-fit=cover' -e 'safe-area-inset' $SRC
# LAY-10 layout chosen from the device
rg -n "${X[@]}" -e 'navigator\.userAgent' -e 'screen\.(width|height|orientation)' $SRC
# LAY-13 px spacing to compare with the scale
rg -n "${X[@]}" '\b(padding|margin|gap|row-gap|column-gap|inset)(-[a-z-]+)?\s*:[^;]*[0-9.]+px' $SRC
# LAY-14 margins on repeated children; redefined spacing tokens
rg -n "${X[@]}" -e '>\s*\*\s*\+\s*\*' -e ':not\(:last-child\)' -e '--md-sys-measurement-space[0-9]+\s*:' $SRC
# LAY-17 physical sides in mirrored UI (env(safe-area-inset-*) padding is the exception)
rg -n "${X[@]}" -e '(margin|padding|border)-(left|right)\b' -e '(^|[\s;{])(left|right)\s*:' -e 'text-align\s*:\s*(left|right)' -e 'float\s*:\s*(left|right)' -e 'border-(top|bottom)-(left|right)-radius' $SRC

# SHP-02..05 literal radii, 50% pills, 9999px; unitless zero shape tokens
rg -n "${X[@]}" -e 'border(-[a-z]+)*-radius\s*:\s*[0-9.]+(px|rem|em|%)' -e '9999px' -e 'infinity' $SRC
rg -n "${X[@]}" -e '--md-sys-shape-[a-z-]+\s*:\s*0\s*;' $SRC
# SHP-10 library shapes and clip paths
rg -n "${X[@]}" -e 'var\(--m3e-shape-' -e 'url\(#m3-shape-' -e 'clip-path\s*:\s*(path|shape|polygon)\(' $SRC
# SHP-16 corner-shape
rg -n "${X[@]}" 'corner-shape' $SRC

# MOT-01 literal durations and easing keywords
rg -n "${X[@]}" -e '(transition|animation)(-duration)?\s*:[^;]*\b[0-9.]+m?s\b' -e '\b(ease|ease-in|ease-out|ease-in-out)\b' -e 'cubic-bezier\(' -e 'duration\s*:\s*[0-9]' $SRC
# MOT-02 effects properties on spatial helpers
rg -n "${X[@]}" '(opacity|color|background-color|border-color|outline-color|fill|stroke|filter|box-shadow)\s+var\(--m3e-motion-spring-[a-z]+-spatial' $SRC
# MOT-05 motion scheme switches
rg -n "${X[@]}" 'data-motion-scheme|motionScheme' $SRC
# MOT-08 linear() traces (each must sit inside @supports)
rg -n "${X[@]}" -e '(spatial|effects|emphasized)-linear' -e '\blinear\(' $SRC
# MOT-09 reduced-motion handling and motion the token file can't reach
rg -n "${X[@]}" -e 'prefers-reduced-motion' -e '@keyframes' -e '\.animate\(' -e 'requestAnimationFrame' -e 'startViewTransition' -e 'view-transition' $SRC
# MOT-15 spring helpers composed on :root
rg -n -U "${X[@]}" ':root\s*\{[^}]*var\(--m3e-motion-spring-' $SRC

# ELV-01 shadows that don't use a level helper; SHP-13 hand-written drop-shadow() chains
rg -n "${X[@]}" 'box-shadow\s*:' $SRC | rg -v 'm3e-elevation-shadow|box-shadow\s*:\s*none'
rg -n "${X[@]}" 'drop-shadow\(' $SRC
# ELV-02 level 4 and 5 (should appear only in hover or drag rules)
rg -n "${X[@]}" 'm3e-elevation-shadow-level[45]' $SRC
# ELV-06 surface tint and tint overlays
rg -n "${X[@]}" -e 'surface-tint' -e 'surfaceColorAtElevation' -e 'color-mix\([^;]*color-primary\)[^;]*color-surface' $SRC
# ELV-13 elevation distances used as paint
rg -n "${X[@]}" '(box-shadow|filter|--md-elevation-level)\s*:[^;]*--md-sys-elevation-level' $SRC

# STA-02 pre-2023 opacities, black or white overlays, brightness filters
rg -n "${X[@]}" -e '(^|[^0-9])0?\.12\b' -e '\b12%' -e 'rgba?\(\s*(0|255)\s*,\s*(0|255)\s*,\s*(0|255)\s*,\s*0?\.[0-9]+\s*\)' -e 'brightness\(' $SRC
# STA-04 removed outlines; box-shadow focus rings; replacement rings on native inputs (pair them up)
rg -n "${X[@]}" 'outline\s*:\s*(none|0)\b' $SRC
rg -n -U "${X[@]}" ':focus(-visible|-within)?[^{]*\{[^}]*box-shadow' $SRC
rg -n "${X[@]}" -e '::-(webkit-slider|moz-range)-thumb' -e ':has\([^)]*:focus-visible' $SRC
# STA-06 / STA-07 element opacity or pointer-events on disabled states (-P: matches the opacity
# property, not token names that contain "opacity", and skips :not(:disabled) guards)
rg -n -U -P "${X[@]}" '(?<!not\()(:disabled|aria-disabled)[^{]*\{[^}]*((?<![\w-])opacity\s*:|pointer-events\s*:\s*none)' $SRC
# STA-11 hover rules (each should sit inside @media (hover: hover))
rg -n "${X[@]}" ':hover' $SRC
# STA-14 deprecated drag ARIA
rg -n "${X[@]}" -e 'aria-grabbed' -e 'aria-dropeffect' $SRC
# A11Y-04 positive tabindex and visual reordering
rg -n "${X[@]}" -e 'tabindex="?[1-9]' -e '(^|[\s;{])order\s*:' -e 'grid-template-areas' $SRC
```

### Console snippets

Paste into the DevTools console of a Chromium-based browser (Chrome 121 or later). Each prints a table
and returns its rows. They read computed styles, so they work on any framework and with or without this
skill's token file. Stylesheets from another origin can't be read (T6 lists them). Run them at the
browser's default font size and 100% zoom, and again in each context the check calls for.

#### T1 Text contrast

Every visible text element whose contrast against its composited background is below 4.5:1 (3:1 for large
text). Text over images or gradients is listed for a manual check. Disabled text is skipped.

```js
// T1 Text contrast (A11Y-01). Run once per theme x contrast context.
(() => {
  const parse = (s) => {
    if (!s || s === 'transparent') return [0, 0, 0, 0];
    let m = s.match(/^rgba?\(([^)]+)\)$/);
    if (m) { const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [r / 255, g / 255, b / 255, a]; }
    m = s.match(/^color\(srgb ([^)]+)\)$/);
    if (m) { const [r, g, b, a = 1] = m[1].split(/[\s/]+/).filter(Boolean).map(Number); return [r, g, b, a]; }
    return null;                                       // another color space: measure by hand
  };
  const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);
  const lum = (c) => c.slice(0, 3).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  const probe = document.createElement('div');           // the page canvas color (follows color-scheme)
  probe.style.background = 'Canvas';
  document.documentElement.append(probe);
  const canvas = parse(getComputedStyle(probe).backgroundColor);
  probe.remove();
  const backdrop = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== 'none') return null;   // image or gradient: measure by hand
      const c = parse(cs.backgroundColor);
      if (!c) return null;
      if (c[3] > 0) layers.push(c);
      if (c[3] === 1) break;
    }
    return layers.reduceRight((under, c) => over(c, under), canvas);
  };
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('');
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    if (el.closest(':disabled, [aria-disabled="true"]')) continue;   // disabled text is exempt
    const cs = getComputedStyle(el);
    const bg = backdrop(el), fg = parse(cs.color);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (!bg || !fg) { rows.push({ element: name(el), text: el.textContent.trim().slice(0, 40), ratio: 'check by hand', need }); continue; }
    const text = over(fg, bg);
    const r = ratio(text, bg);
    if (r < need) rows.push({ element: name(el), text: el.textContent.trim().slice(0, 40), fg: hex(text), bg: hex(bg), ratio: +r.toFixed(2), need });
  }
  console.table(rows);
  return rows;
})();
```

It ignores element `opacity` below 1 and content painted by positioned siblings behind the text; check
those by hand.

#### T2 Type scale

Groups all text by computed size, line height, weight and letter spacing, and names the matching style
and language height. `OFF-SCALE` rows fail TYP-01.

```js
// T2 Type scale (TYP-01, TYP-04). Run at the browser's default font size (16px).
(() => {
  // role, size, tracking (px), baseline weight, emphasized weight, line height: small, medium, large, extra-large
  const SCALE = [
    ['display-large', 57, -0.25, 400, 500, 64, 73, 89, 120], ['display-medium', 45, 0, 400, 500, 52, 56, 71, 99],
    ['display-small', 36, 0, 400, 500, 44, 47, 57, 80], ['headline-large', 32, 0, 400, 500, 40, 42, 50, 75],
    ['headline-medium', 28, 0, 400, 500, 36, 38, 45, 66], ['headline-small', 24, 0, 400, 500, 32, 35, 41, 59],
    ['title-large', 22, 0, 400, 500, 28, 31, 36, 53], ['title-medium', 16, 0.15, 500, 700, 24, 27, 31, 42],
    ['title-small', 14, 0.1, 500, 700, 20, 23, 26, 36], ['body-large', 16, 0.5, 400, 500, 24, 27, 31, 41],
    ['body-medium', 14, 0.25, 400, 500, 20, 23, 26, 35], ['body-small', 12, 0.4, 400, 500, 16, 18, 21, 30],
    ['label-large', 14, 0.1, 500, 700, 20, 23, 26, 36], ['label-medium', 12, 0.5, 500, 700, 16, 18, 21, 30],
    ['label-small', 11, 0.5, 500, 700, 16, 18, 21, 29],
  ];
  const HEIGHTS = ['small', 'medium', 'large', 'extra-large'];
  if (getComputedStyle(document.documentElement).fontSize !== '16px') console.warn('Root font size is not 16px: reset the browser font size first.');
  const near = (a, b) => Math.abs(a - b) < 0.05;
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('');
  const groups = new Map();
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (!el.checkVisibility()) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize), weight = +cs.fontWeight;
    const lh = cs.lineHeight === 'normal' ? NaN : parseFloat(cs.lineHeight);
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing);
    const variable = !!el.closest('[data-typeface="variable"]');   // Roboto Flex context: tracking 0
    const matches = [];
    for (const [role, s, t, bw, ew, ...lhs] of SCALE) {
      if (!near(size, s) || !(near(ls, t) || (variable && near(ls, 0)))) continue;
      const h = lhs.findIndex((v) => near(lh, v));
      if (h < 0) continue;
      if (weight === bw) matches.push(`${role} (${HEIGHTS[h]})`);
      else if (weight === ew) matches.push(`emphasized-${role} (${HEIGHTS[h]})`);
    }
    const key = `${size}px / ${cs.lineHeight} / ${weight} / ${cs.letterSpacing}`;
    const g = groups.get(key) ?? { 'size / line-height / weight / tracking': key, count: 0, example: name(el),
      match: matches.join(', ') || 'OFF-SCALE' };
    g.count++;
    groups.set(key, g);
  }
  const rows = [...groups.values()].sort((a, b) => (a.match === 'OFF-SCALE' ? -1 : 1) - (b.match === 'OFF-SCALE' ? -1 : 1));
  console.table(rows);
  return rows;
})();
```

A match with the wrong language height (for example `(medium)` on an English page) points to TYP-13.

#### T3 Corner radii

Lists elements with a radius off the scale, `50%` on a non-square box, elliptical corners, or 9999px beside
smaller radii. A radius of half the shorter side or more counts as full.

```js
// T3 Corner radii (SHP-01, SHP-03, SHP-04).
(() => {
  const SCALE = [0, 4, 8, 12, 16, 20, 28, 32, 48];
  const CORNERS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('');
  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const corners = CORNERS.map((p) => cs[p]);
    if (corners.every((c) => c === '0px')) continue;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    const half = Math.min(box.width, box.height) / 2;
    const issues = new Set();
    const px = corners.map((c) => {
      const [x, y = x] = c.split(' ');
      if (x !== y) issues.add(`elliptical corner ${c}`);
      if (x.endsWith('%')) {
        if (Math.abs(box.width - box.height) > 0.5) issues.add(`${x} on a non-square box: elliptical ends, not a stadium`);
        return half;
      }
      return parseFloat(x);
    });
    for (const v of px) if (!SCALE.includes(v) && v < half - 0.5) issues.add(`${v}px is off the scale`);
    if (px.some((v) => v >= 9999) && px.some((v) => v > 0 && v < half - 0.5)) issues.add('9999px beside smaller radii');
    if (issues.size) rows.push({ element: name(el), box: `${Math.round(box.width)}x${Math.round(box.height)}`,
      radii: corners.join(' | '), issues: [...issues].join('; ') });
  }
  console.table(rows);
  return rows;
})();
```

#### T4 Shadows

Matches every computed `box-shadow` against the six levels, whether written with the helpers, `color-mix()`
or `rgba()`. Run it with the pointer off the page and nothing dragged.

```js
// T4 Shadows (ELV-01, ELV-02, ELV-04). Run with the pointer off the page and nothing dragged.
(() => {
  const LEVELS = ['none',
    '0 1px 2px 0 rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)', '0 1px 2px 0 rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)',
    '0 1px 3px 0 rgba(0,0,0,.3), 0 4px 8px 3px rgba(0,0,0,.15)', '0 2px 3px 0 rgba(0,0,0,.3), 0 6px 10px 4px rgba(0,0,0,.15)',
    '0 4px 4px 0 rgba(0,0,0,.3), 0 8px 12px 6px rgba(0,0,0,.15)'];
  // color-mix() results serialize as color(srgb r g b / a); rewrite them as rgba() so both forms compare equal.
  const norm = (s) => s.replace(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/g,
    (_, r, g, b, a = '1') => `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${+a})`)
    .replace(/rgb\((\d+), (\d+), (\d+)\)/g, 'rgba($1, $2, $3, 1)');
  const probe = document.createElement('div');
  document.body.append(probe);
  const known = LEVELS.map((v) => { probe.style.boxShadow = v; return norm(getComputedStyle(probe).boxShadow); });
  probe.remove();
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('');
  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    const shadow = norm(getComputedStyle(el).boxShadow);
    if (shadow === 'none') continue;
    const level = known.indexOf(shadow);
    rows.push({ element: name(el), level: level < 0 ? 'ad hoc' : level,
      issue: level < 0 ? 'not one of the six levels (ELV-01)' : level >= 4 ? 'level 4-5 at rest (ELV-02)' : 'resting shadow: justify it (ELV-04)',
      boxShadow: shadow.slice(0, 90) });
  }
  console.table(rows);
  return rows;
})();
```

A product that re-themes `--md-sys-color-shadow` shows its levels as "ad hoc"; compare the geometry by eye
there.

#### T5 Targets

Probes eight points on a 48px square around each target's centre with `elementFromPoint`, so the real hit
area counts (pseudo-element extensions and wrapping labels included), and measures the gap to the nearest
other target. A checkbox or radio is measured by its label, since the label is what people press in a
switch row or a segment. Neighbors that line up edge to edge (same top and bottom, or same left and right)
at most 2px apart are treated as tiled and listed in a second table instead of failing the gap. Only
targets in the viewport are checked: scroll and run it again.

```js
// T5 Targets (A11Y-03). Probes the real hit area, so pseudo-element hit areas and labels count.
// Checks elements in the viewport only: scroll and run again. Returns { rows, tiled }.
(() => {
  const MIN = 48;   // --m3e-min-target-size; use 44 for pointer-only products
  const GAP = 8;    // between separate targets
  const TILE = 2;   // widest gap between rows, segments or items that tile one container
  const SEL = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], ' +
    '[role="checkbox"], [role="radio"], [role="switch"], [role="tab"], [role="menuitem"], [role="option"], [role="slider"], ' +
    '[tabindex]:not([tabindex="-1"])';
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('') + (el.getAttribute('aria-label') ? ` "${el.getAttribute('aria-label')}"` : '');
  const owns = (el, t) => !!t && (t === el || el.contains(t) || [...(el.labels ?? [])].some((l) => l.contains(t)));
  // A checkbox or radio (switch rows, hidden radios in segments) is pressed through its label: measure the largest one.
  const rect = (el) => {
    const labels = /^(checkbox|radio)$/.test(el.type) ? [...(el.labels ?? [])] : [];
    const found = labels.map((l) => l.getBoundingClientRect()).filter((b) => b.width && b.height);
    return found.length ? found.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a)) : el.getBoundingClientRect();
  };
  const lined = (a, b) => (Math.abs(a.top - b.top) < 1 && Math.abs(a.bottom - b.bottom) < 1) ||
    (Math.abs(a.left - b.left) < 1 && Math.abs(a.right - b.right) < 1);
  const shared = (a, b) => { let n = a.parentElement; while (n && !n.contains(b)) n = n.parentElement; return n; };
  const targets = [...document.querySelectorAll(SEL)].filter((el) => el.checkVisibility({ visibilityProperty: true }));
  const boxes = targets.map((el) => [el, rect(el)]);
  const rows = [], tiled = new Map();
  for (const [el, r] of boxes) {
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
    const d = MIN / 2 - 1;
    const probes = [[-d, -d], [0, -d], [d, -d], [d, 0], [d, d], [0, d], [-d, d], [-d, 0]];
    const missed = probes.filter(([x, y]) => !owns(el, document.elementFromPoint(cx + x, cy + y))).length;
    let nearest = Infinity, overlaps = 0;
    for (const [other, o] of boxes) {
      if (other === el || other.contains(el) || el.contains(other)) continue;
      const w = Math.min(r.right, o.right) - Math.max(r.left, o.left), h = Math.min(r.bottom, o.bottom) - Math.max(r.top, o.top);
      if (w > 1 && h > 1) { overlaps++; continue; }
      const gap = Math.hypot(Math.max(0, -w), Math.max(0, -h));
      if (gap <= TILE + 0.5 && lined(r, o)) {
        const c = shared(el, other);
        const g = tiled.get(c) ?? { container: c ? name(c) : 'document', targets: new Set(), gaps: new Set() };
        g.targets.add(el).add(other);
        g.gaps.add(+gap.toFixed(1));
        tiled.set(c, g);
      } else nearest = Math.min(nearest, gap);
    }
    const inline = getComputedStyle(el).display === 'inline';
    if (missed || nearest < GAP || overlaps) rows.push({ element: name(el), box: `${Math.round(r.width)}x${Math.round(r.height)}`,
      [`${MIN}px hit area`]: missed ? `fails (${missed}/8 probes miss)` : 'ok',
      gap: nearest === Infinity ? '-' : +nearest.toFixed(1), overlaps, inline });
  }
  const groups = [...tiled.values()].map((g) => ({ container: g.container, targets: g.targets.size,
    'gaps (px)': [...g.gaps].sort((a, b) => a - b).join(', ') }));
  console.table(rows);
  if (groups.length) {
    console.log('Treated as tiled, so no gap is required. Confirm each is one list, segmented control or connected group:');
    console.table(groups);
  }
  return { rows, tiled: groups };
})();
```

`inline: true` rows are usually links in running text, which WCAG exempts. The gap is measured between
the measured boxes. The tiled table needs a look: rows, segments and connected groups belong there, but a
toolbar of icon buttons whose 48px boxes touch lands there too, and separate targets like those should
keep 8px between their visible parts (each visual inset by 4px from its box).

#### T6 Breakpoints

Lists every width and height in `@media` and `@container` conditions across readable stylesheets, with a
verdict against 600, 840, 1200 and 1600px (480 and 900px for height).

```js
// T6 Breakpoints in media and container conditions (LAY-01). Cross-origin sheets are listed for a manual check.
(() => {
  const WIDTH = [600, 840, 1200, 1600], HEIGHT = [480, 900];
  const found = new Map(), skipped = [];
  const note = (rule, kind) => {
    for (const [, feature] of rule.conditionText.matchAll(/\(([^()]*)\)/g)) {
      const dim = /height|block-size/.test(feature) ? 'height' : /width|inline-size/.test(feature) ? 'width' : null;
      if (!dim) continue;
      for (const [, n, unit] of feature.matchAll(/([\d.]+)(px|em|rem)\b/g)) {
        const px = unit === 'px' ? +n : +n * 16;
        const key = `${kind} ${dim} ${n}${unit}`;
        const set = dim === 'width' ? WIDTH : HEIGHT;
        const verdict = set.includes(px + 1) && unit === 'px' ? 'leaves a 1px gap at fractional widths: use < or .98'
          : !set.includes(Math.round(px)) ? 'off-scale'
          : unit !== 'px' ? 'M3 value in em/rem: document as a deviation'
          : 'ok';
        const row = found.get(key) ?? { condition: key, px, verdict, rules: 0, example: rule.conditionText };
        row.rules++;
        found.set(key, row);
      }
    }
  };
  const walk = (rules) => {
    for (const rule of rules) {
      if (rule instanceof CSSImportRule) { try { walk(rule.styleSheet.cssRules); } catch { skipped.push(rule.href); } continue; }
      if (rule instanceof CSSMediaRule) note(rule, '@media');
      else if (window.CSSContainerRule && rule instanceof CSSContainerRule) note(rule, '@container');
      if (rule.cssRules) walk(rule.cssRules);
    }
  };
  for (const sheet of document.styleSheets) {
    try { walk(sheet.cssRules); } catch { skipped.push(sheet.href); }
  }
  const rows = [...found.values()];
  console.table(rows);
  if (skipped.length) console.warn('Not readable (cross-origin), check by hand:', skipped);
  return { rows, skipped };
})();
```

Off-scale `@container` values inside panes are judged by LAY-08, not LAY-01. Pages opened from `file://`
count as cross-origin; serve them over http.

#### T7 Transitions

Lists transitions that put an overshooting curve on an effects property, use `transition: all`, or use a
curve outside the M3 set. It sees the current state only, so hover, open and select things and run it
again. Keyframe animations: inspect `document.getAnimations()`.

```js
// T7 Transitions (MOT-01, MOT-02). Lists transitions in the current state; toggle states and run again.
(() => {
  const EFFECTS = /^(opacity|color|background-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?-color|outline-color|fill|stroke|filter|backdrop-filter|box-shadow|text-decoration-color|caret-color)$/;
  const KNOWN = new Set([
    '0.42, 1.67, 0.21, 0.9', '0.38, 1.21, 0.22, 1', '0.39, 1.29, 0.35, 0.98', '0.27, 1.06, 0.18, 1',   // spatial springs
    '0.31, 0.94, 0.34, 1', '0.34, 0.8, 0.34, 1', '0.34, 0.88, 0.34, 1',                                 // effects springs
    '0.2, 0, 0, 1', '0.05, 0.7, 0.1, 1', '0.3, 0, 0.8, 0.15', '0, 0, 0, 1', '0.3, 0, 1, 1',            // legacy M3
    '0.4, 0, 0.2, 1', '0, 0, 0.2, 1', '0.4, 0, 1, 1', '0, 0, 1, 1',                                    // legacy M2, linear
  ].map((v) => `cubic-bezier(${v})`));
  const split = (s) => s.split(/,(?![^()]*\))/).map((v) => v.trim());
  const overshoots = (fn) => {
    const bez = fn.match(/^cubic-bezier\(([^)]+)\)$/);
    if (bez) { const [, y1, , y2] = bez[1].split(',').map(Number); return y1 < 0 || y1 > 1 || y2 < 0 || y2 > 1; }
    const lin = fn.match(/^linear\((.+)\)$/);
    return !!lin && split(lin[1]).some((stop) => parseFloat(stop) < 0 || parseFloat(stop) > 1);
  };
  const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
    [...el.classList].slice(0, 2).map((c) => `.${c}`).join('');
  const rows = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const props = split(cs.transitionProperty), durs = split(cs.transitionDuration), fns = split(cs.transitionTimingFunction);
    props.forEach((prop, i) => {
      const dur = durs[i % durs.length], fn = fns[i % fns.length];
      if (parseFloat(dur) === 0) return;
      const issues = [];
      if ((EFFECTS.test(prop) || prop === 'all') && overshoots(fn)) issues.push('overshooting curve on an effects property (MOT-02)');
      if (prop === 'all') issues.push('transition: all (MOT-01)');
      if (/^(ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/.test(fn) || (fn.startsWith('cubic-bezier') && !KNOWN.has(fn)))
        issues.push('curve outside the M3 set (MOT-01)');
      if (issues.length) rows.push({ element: name(el), property: prop, duration: dur, easing: fn.slice(0, 48), issues: issues.join('; ') });
    });
  }
  console.table(rows);
  return rows;
})();
```

`linear()` traces are accepted as M3 curves; MOT-06 and MOT-08 cover their values and fallback.

#### T8 Font weights

Compares every font family and weight used by text on the page with the web font faces that loaded.

```js
// T8 Font weights (TYP-09): every family + weight used on the page against the loaded web font faces.
(async () => {
  await document.fonts.ready;
  const faces = [...document.fonts].filter((f) => f.status === 'loaded');
  const clean = (f) => f.split(',')[0].trim().replace(/^["']|["']$/g, '');
  const covers = (face, w) => { const [lo, hi = lo] = face.weight.split(' ').map(Number); return w >= lo && w <= hi; };
  const used = new Map();
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const key = `${clean(cs.fontFamily)} ${cs.fontWeight}`;
    used.set(key, { family: clean(cs.fontFamily), weight: +cs.fontWeight, elements: (used.get(key)?.elements ?? 0) + 1 });
  }
  const rows = [...used.values()].map((u) => {
    const same = faces.filter((f) => clean(f.family) === u.family);
    return { ...u, status: !same.length ? 'no web font loaded for this family (local or fallback font)'
      : same.some((f) => covers(f, u.weight)) ? 'ok' : 'weight not loaded: synthetic or substituted' };
  });
  console.table(rows);
  return rows;
})();
```

A "no web font loaded" row means the text renders in a locally installed or fallback face; confirm in
DevTools › Computed › Rendered Fonts which one.

### CSS probes

Temporary overrides for visual checks. Add one block at a time in DevTools (Elements › Styles › new style
rule, or a local override) and remove it afterwards.

```css
/* ELV-03, ELV-11: remove every shadow so only tone separates surfaces. */
*, *::before, *::after {
  box-shadow: none !important;
  filter: none !important;
}

/* A11Y-06: the WCAG 1.4.12 text-spacing values. */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p {
  margin-block-end: 2em !important;
}
```

## Findings report template

Copy the block, fill it in, and keep one row per finding. Sort findings by severity, then by ID. Every
check in scope gets a verdict (Pass, Fail, N/A or Not verified); every failure gets a severity (Blocker,
Major or Minor), its location, the observed and expected values and a fix written in tokens or helpers.

```markdown
# M3 Expressive foundations audit: <product or screen set>

- Date and auditor:
- Build, commit or URL:
- Inputs: live page / source (framework) / screenshots (device pixel ratio) / design spec
- Product: utilitarian or expressive; token source (this skill's token file, Material Web, own system)
- Scope: screens, each with its primary action; hero moments; widths; color contexts (light/dark ×
  standard/medium/high) and forced colors; motion schemes and reduced motion; directions and languages;
  200% text
- Type: full audit / quick audit (12 checks)
- Result: <n> blockers, <n> major, <n> minor. Checks: <n> pass, <n> fail, <n> N/A, <n> not verified

## Findings

| ID | Location | Observed | Expected | Severity | Fix |
|---|---|---|---|---|---|
| A11Y-01 | Settings › footer caption @ 412px, light/standard | `outline` (#79747E) text on `surface-container` (#F3EDF7): 3.96:1 (T1) | 4.5:1 for 14px text | Blocker | Color it `on-surface-variant` (8.13:1 on the same fill) |
| COL-07 | `src/styles/filters.css:12` `.chip-row .chip` (9 chips) | `secondary-container` fill, 1.23:1 against `surface`, no border | Boundary or fill at 3:1 or more | Major | `border: 1px solid var(--md-sys-color-outline)` |
| SHP-03 | `src/components/Tag.css:8` `.tag` | `border-radius: 50%` on a 96×32px box: elliptical ends (T3) | Stadium: all four corners full | Major | `border-radius: var(--md-sys-shape-corner-full)` |

## Verdicts by check

| ID | Verdict | Note |
|---|---|---|
| PRI-01 | Pass | |
| LAY-12 | N/A | No resizable panes |
| MOT-07 | Not verified | Screenshots only |

## Open items

- Checks not verified, and what input would settle them.
```
