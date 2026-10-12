---
name: m3-expressive-foundations
description: Material 3 Expressive (M3 Expressive, Material 3, Material You) design foundations for the web and any UI framework, with a drop-in CSS token file. Use this skill whenever you design, build, theme, restyle or audit a UI to Material 3 or M3 Expressive in React, Vue, Svelte, Angular, Lit or plain HTML/CSS, even when the request only says "make it look like Material" or "Android-style". It covers design tokens as CSS custom properties; color roles, dynamic color from a seed or brand color, dark mode and contrast levels; the type scale and emphasized type; the corner radius scale, shape library and shape morph; spring motion and easing; elevation, shadows and scrims; state layers, focus rings and touch targets; breakpoints (window size classes), panes, margins and the spacing scale; and how much expression a screen should carry. Foundations only; it does not specify individual components (button sizes, app bar variants), but it applies to any component you style.
---

# M3 Expressive foundations

M3 Expressive is Google's May 13, 2025 expansion of Material 3, not a new version: there is no "M4", M3 is not
deprecated, and the same roles and tokens carry over. It added seven design tactics, spring motion, 15 emphasized
type styles, three larger corner steps and a 35-shape library with morphing; in Google's research people found key
elements up to 4x faster. Pane-based "Expressive layout" with 8dp spacing tokens followed in May 2026, and
per-script line heights in Aug 2026.

This skill turns those foundations into decisions and code for any web stack: a reference per foundation, a
one-page quick reference of exact values, an audit checklist, a CSS file with every token as a custom property,
the shape library as CSS/SVG/JSON, and a scheme generator. The web needs it: as of September 2026 Material Web is
in maintenance mode and does not implement Expressive (Compose has it in Material3 1.5.0-alpha29; 1.4.0 is
stable), so you build the foundations from these tokens in plain CSS and JS.

## Core principles

1. **Expression serves hierarchy.** Add a bold shape, color or motion only where it makes the key element
   quicker to find or the key action easier to hit. Styling that clarifies nothing is noise.
2. **One primary action per screen.** Make it the largest action on the screen (a button or FAB; list rows,
   sliders and form controls don't compete), with the strongest color role and the easiest reach, and step
   everything else down, so the eye has a single place to land.
3. **Seven tactics, each an independent dial:** shape variety, rich color roles, emphasized type, containment,
   spring motion, component flexibility, and hero moments that combine them. Turn up only the ones that help.
4. **Restraint is part of the design.** Keep one or two hero moments per product, quieter secondary screens and
   standard motion for utilitarian products, because stacked tactics compete and a sizeable minority prefers calm.
5. **Keep familiar patterns.** Lists stay lists, actions keep text labels, navigation stays where people
   expect it. The designs that failed in Google's testing broke exactly these.
6. **Everything flows through tokens** (reference, system, component). Components read `--md-sys-*` tokens and
   `--m3e-*` helpers (never `--md-ref-*`); contexts (theme, contrast, motion scheme, typeface, language height)
   swap values, never names, so one stylesheet fits all.
7. **Accessibility is the floor, not a tactic.** Keep `on-X`/`X` role pairs; targets of at least 48×48px with
   8px between separate targets (rows, segments and connected groups that tile a container edge to edge need no
   gap, but each still reaches 48px); a visible 3px focus ring; and the user's contrast and motion settings.
   A treatment that breaks these is wrong.
8. **Motion is physical.** Springs move position and shape (spatial) or color and opacity (effects), fast,
   default or slow by the element's size and how far it travels. Only spatial springs bounce, since color and
   opacity have hard limits.
9. **Separate surfaces by tone first.** Nested regions take different surface-container roles. Shadows are
   for protection over busy backgrounds and for lift during interaction; surface tint is deprecated.
10. **Adapt to the window, not the device.** Width breakpoints decide panes and navigation, and extra space
    should reveal a second pane or more content instead of stretching the compact layout.

## When to use this skill

Use it in any framework, or none, for:
- Building or restyling a UI to Material 3 / M3 Expressive, and deciding how expressive a product or screen
  should be and where its hero moments go.
- Setting up a token layer as CSS custom properties with light/dark, three contrast levels and two motion
  schemes; theming from a brand or seed color; porting Compose, MDC-Android or Theme Builder tokens to the web.
- Choosing or checking color roles, type styles, corner radii, library shapes and morphs, springs and easing,
  elevation, state layers, focus rings, breakpoints, panes, margins and spacing.
- Auditing a page, component library, stylesheet, screenshot or design spec against these foundations.

It does not give component specs (sizes, anatomy, component tokens); components appear only as examples of a
foundation. For a component's exact values, run `node scripts/fetch-m3-spec.mjs components/<name> --tokens`, which
reads the page and its token table from m3.material.io (the site itself is a JavaScript shell that fetching tools
see as empty), and build it from these foundations. Nor does the skill cover Material 2 or native Android.

## How to use it

**Building or theming**
1. Set the intensity first. Open `references/expressive-principles.md` (restraint rules, emphasis ladder,
   intensity by product type) and name each screen's primary action and the product's hero moments.
2. Install the tokens (Quick start below). For a brand palette, run `scripts/generate-scheme.mjs` instead of
   hand-picking hex values, so every role, theme and contrast level stays paired.
3. Structure the page with `references/layout.md`; style it with `color.md`, `typography.md`, `shape.md`, `elevation.md`;
   add behavior with `interaction-states.md` and `motion.md`. Open only what the task touches: each file stands alone.
   Look up a single value in `references/quick-reference.md`. On Angular Material, start from
   `references/angular-material.md`: it maps these tokens to Material's and says how to add Expressive press shapes
   and spring motion to Material's own components.
4. Before finishing, run the [Quick audit](references/audit-checklist.md#quick-audit) in
   `references/audit-checklist.md`, plus the Auditing list at the end of each reference you used.

**Auditing**
1. Open `references/audit-checklist.md`. Its [inputs table](references/audit-checklist.md#inputs) says what a
   live page, code in any framework, a screenshot or a design spec can show. List the screens in scope, each
   screen's primary action and the hero moments.
2. Run the [Quick audit](references/audit-checklist.md#quick-audit) (12 checks) first. A short review can stop
   there, reported as a quick audit rather than a full verdict.
3. For a full audit, follow [Passes, in order](references/audit-checklist.md#passes-in-order): the grep set and
   console snippets T1–T8, then the checks by foundation that the UI uses (PRI, LAY, COL, TYP, SHP, MOT, ELV,
   STA) and the A11Y cross-checks, in every context under
   [Contexts to cover](references/audit-checklist.md#contexts-to-cover): light and dark at all three contrast
   levels, both motion schemes, reduced motion, forced colors, `dir="rtl"`, 200% text and each breakpoint.
   Failures that turn up most: raw hex or px where a token or helper exists, `--md-ref-*` in component CSS,
   `50%` pills, `9999px` beside or animated to other radii, the outdated 0.12 state-layer opacity, surface-tint
   overlays, shadows separating flat regions, focus shown by tint alone, bouncing color or opacity.
4. Give every check in scope a verdict (Pass, Fail, N/A or Not verified) and each failure a
   [severity](references/audit-checklist.md#severity) (Blocker, Major or Minor), with its location, the observed
   and expected values and a token-based fix. Write it up with the
   [findings report template](references/audit-checklist.md#findings-report-template). Each check links to the
   topic reference that explains its rule.

## Reference index

| File | Open it when |
|---|---|
| `references/expressive-principles.md` | Deciding how much expression a product or screen carries, placing hero moments, building hierarchy around one action, token architecture and contexts, overriding the shipped file, theming, the accessibility floor, web platform status |
| `references/color.md` | Choosing or auditing roles and pairs, emphasis with accent families and surface tones, a grouped list (settings) screen, dark mode, contrast levels and an appearance-settings control, HCT and tonal palettes, seed, brand or image schemes, custom colors such as success, MCU code |
| `references/typography.md` | Setting or auditing text styles, baseline vs emphasized type, typefaces and font loading (including self-hosted and offline), Roboto Flex axes, tall scripts (language height), readability and line length, editorial moments |
| `references/shape.md` | Corner radii, pills and "full", asymmetric and RTL corners, nested radii and grouped-list corners, pressed and selected shapes by button size and a site-wide press morph, button groups, library shapes for crops and avatars, shape morphing, cut corners |
| `references/motion.md` | Any animation: schemes, spatial vs effects, speeds, curves vs `linear()` traces, legacy easing and duration, transition patterns, reduced motion and an in-app Reduce motion setting, restraint in navigation, matching enter and exit, items arriving in virtualized lists, WAAPI, JS springs, View Transitions |
| `references/elevation.md` | Separating surfaces, shadows (including on clipped shapes), a scrolled app bar, modals and scrims (and none in see-through windows), z-index and the top layer, migrating surface-tint code |
| `references/interaction-states.md` | Hover, focus, pressed, dragged, disabled and selected styles; state layers, focus rings (also on native range, switch and radio inputs), ripples, touch targets, state shown through shape |
| `references/layout.md` | Page structure, breakpoints, panes and list-detail, margins, spacing tokens, density, grids, foldables, RTL; media-query, container-query and drag-handle code; screen patterns from product reviews (filter chips on lists, list plus FAB instead of tabs on a phone, quiet secondary actions) |
| `references/angular-material.md` | An app built on Angular Material: `--mat-sys-*` vs `--md-sys-*`, restyling through component tokens, the press morph on Material's buttons, retiming Material's dialog, menu, select, snackbar, tooltip, switch and tab animations, `animate.enter`/`animate.leave`, Expressive vertical menus and a menu with a search, gotchas, checking after an upgrade |
| `references/quick-reference.md` | Looking up an exact value: breakpoints, margins, spacing, corners, the type scale, springs and legacy easing, state opacities, focus ring, targets, elevation and shadows, baseline colors, and every `--m3e-*` helper |
| `references/audit-checklist.md` | Auditing any UI (live page, code, screenshot or design spec): the Quick audit, checks by foundation with IDs and severities, grep set, console snippets T1–T8, findings report template |
| `assets/m3-expressive-tokens.css` | Whenever you write CSS: every token and web helper, plus the switches below. It is the source of truth for every value |
| `assets/material-shapes.css` | Library shapes as `--m3e-shape-<id>` values for `clip-path` (CSS `shape()`: Chrome 135+, Firefox 148+, Safari 18.4+) |
| `assets/material-shapes.svg` | The same 35 shapes as `clipPath` elements (`#m3-shape-<id>`) to inline once, for older browsers |
| `assets/material-shapes.json` | Raw path data in a 0..1 box, for SVG drawing, canvas or morph tooling |
| `scripts/generate-scheme.mjs` | Generating a seed or brand scheme in the token file's format, plus custom colors as `--app-color-*` product tokens at all three contrast levels; needs `@material/material-color-utilities` |
| `scripts/fetch-m3-spec.mjs` | Reading a component's guidance and exact token values from m3.material.io (`--list [filter]`, `<page> --tokens`, `--all-contexts`); Node 18+, no dependencies |

## Quick start

1. Copy `assets/m3-expressive-tokens.css` into the project and load it once, before your own styles: a
   `<link>` in plain HTML, or an import from the app entry or global stylesheet in a bundled app. Load Roboto
   at weights 400, 500 and 700, and `assets/material-shapes.css` only if you use library shapes. For an
   offline or single-file page, self-host Roboto with `@font-face` (or inline woff2), because without a real
   500 face baseline and emphasized styles look alike
   ([typography.md, Self-hosted and offline fonts](references/typography.md#self-hosted-and-offline-fonts)).
2. Put switches on `<html>` or on any subtree. Leave `data-theme` and `data-contrast` off unless the user
   chose a value in your settings, so the OS preference applies.

| Attribute | Values | When absent |
|---|---|---|
| `data-theme` | `light`, `dark` | Follows `prefers-color-scheme` |
| `data-contrast` | `standard`, `medium`, `high` | Standard, or high when the OS reports `prefers-contrast: more` |
| `data-motion-scheme` | `expressive`, `standard` | Expressive (Compose and the token database default to standard) |
| `data-language-height` | `small`, `medium`, `large`, `extra-large` | Picked from `<html lang>` for listed languages, otherwise small. Set `medium` when the language is unknown; a mixed-script block takes its tallest script's category |
| `data-typeface` | `variable` | Static Roboto; `variable` switches to Roboto Flex with tracking 0 |
| `dir` | `rtl`, `ltr` | Mirrors the start/end corner shorthands |

3. **Naming rule.** `--md-*` properties are Material's tokens with dots turned into hyphens
   (`md.sys.color.on-primary` becomes `--md-sys-color-on-primary`). `--m3e-*` properties are this skill's web
   helpers; call them helpers, never Material tokens. The families are:
   - layout: `--m3e-breakpoint-*` (width and height), `--m3e-window-margin` and `--m3e-window-margin-<class>`,
     `--m3e-pane-spacer`, `--m3e-fixed-pane-width-expanded` / `-large`, `--m3e-side-sheet-max-width`;
   - elevation: `--m3e-elevation-shadow-level0..5` (`box-shadow`), `--m3e-elevation-drop-shadow-level0..5`
     (`filter`, for clipped shapes), `--m3e-scrim`, `--m3e-scrim-opacity`;
   - states: `--m3e-focus-indicator-color`, `--m3e-state-layer-size`, `--m3e-min-target-size`,
     `--m3e-state-disabled-container-opacity`;
   - motion: `--m3e-motion-spring-<speed>-<type>` with its `-duration`, `-easing`, `-linear`,
     `-linear-duration` and `-linear-easing` forms, and `--m3e-motion-easing-emphasized-linear`;
   - shape: `--m3e-shape-<id>` in `assets/material-shapes.css`.

   Component CSS reads `--md-sys-*` tokens and `--m3e-*` helpers, never `--md-ref-*`, and never hard-codes a
   value a token or helper already covers. Product-specific properties take the product's own prefix (the
   scheme generator's custom colors are `--app-color-*`), never `--md-` or `--m3e-`.
4. **Overriding.** Color roles hold resolved `light-dark()` literals, so re-theme by overriding `--md-sys-color-*`
   (a palette override changes nothing). Typefaces resolve at `:root`: swap `--md-ref-typeface-brand` / `-plain`
   there, or override `--md-sys-typescale-*` on a subtree. Corners are literals: override `corner-*` and
   `corner-value-*`. Helpers built on roles (shadows, scrim, focus color) also resolve at `:root`, so redeclare
   them on a re-themed subtree.

```css
body {
  margin: 0;
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font);
  font-weight: var(--md-sys-typescale-body-large-weight);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}
main { padding-inline: var(--m3e-window-margin); }
.card {
  background: var(--md-sys-color-surface-container);
  border-radius: var(--md-sys-shape-corner-large);
  padding: var(--md-sys-measurement-space200);
}

/* The screen's one primary action. 56px is an illustrative component height, not a token. */
.primary-action {
  --height: 56px;
  position: relative;
  isolation: isolate;
  block-size: var(--height);
  min-inline-size: var(--m3e-min-target-size);
  padding-inline: var(--md-sys-measurement-space300);
  border: 0;
  border-radius: calc(var(--height) / 2); /* half the height, so the press morph can animate */
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  font-family: var(--md-sys-typescale-label-large-font);
  font-weight: var(--md-sys-typescale-label-large-weight);
  font-size: var(--md-sys-typescale-label-large-size);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  transition: border-radius var(--m3e-motion-spring-fast-spatial);
}
.primary-action::before { /* state layer: the content color over the container */
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {
  .primary-action:enabled:hover::before { opacity: var(--md-sys-state-hover-state-layer-opacity); }
}
.primary-action:enabled:focus-visible::before { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.primary-action:enabled:active::before { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.primary-action:enabled:active { border-radius: var(--md-sys-shape-corner-medium); }
.primary-action:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
```

Disabled styles, ripples and states on native inputs are in `references/interaction-states.md`. Exact values
for every foundation are in `references/quick-reference.md`, and each one matches the token file.
