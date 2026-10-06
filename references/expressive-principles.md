# M3 Expressive principles

M3 Expressive is Google's May 2025 expansion of Material 3. It adds design tactics, tokens and
component updates that use color, shape, size, type, motion and containment to make the most
important thing on a screen obvious and to give the product some feeling. It is not a new version:
M3 roles, tokens and baseline values carry over. Expressive layers options on top: spring motion,
emphasized type, extra corner sizes and a shape library (contrast levels were tokenized the same
month), followed in 2026 by an 8dp spacing system and per-script line heights. This file is the
cross-foundation view: what Expressive is, the research behind it, the seven tactics, when to hold
back, how the token system and the shipped CSS file fit together, and where web support stands. For
per-token detail, open the
foundation references (`color.md`, `shape.md`, `typography.md`, `motion.md`, `layout.md`,
`elevation.md`, `interaction-states.md`).

## Contents

1. [Key ideas](#key-ideas)
2. [What M3 Expressive is](#what-m3-expressive-is)
3. [Research evidence](#research-evidence)
4. [What changed, by foundation](#what-changed-by-foundation)
5. [The seven expressive tactics](#the-seven-expressive-tactics)
6. [Restraint rules](#restraint-rules)
7. [Hierarchy around one primary action](#hierarchy-around-one-primary-action)
8. [Standard vs expressive choices](#standard-vs-expressive-choices)
9. [Token architecture](#token-architecture)
10. [How the shipped CSS file maps to the architecture](#how-the-shipped-css-file-maps-to-the-architecture)
11. [Theming and customization](#theming-and-customization)
12. [Accessibility is the baseline](#accessibility-is-the-baseline)
13. [Platform status on the web](#platform-status-on-the-web)
14. [Applying it on the web](#applying-it-on-the-web)
15. [Do and don't](#do-and-dont)
16. [Auditing](#auditing)
17. [Sources](#sources)

## Key ideas

- **Expression is a tool for hierarchy.** An expressive treatment has earned its place when the key
  element becomes faster to find or the key action easier to hit. In Google's eye-tracking tests,
  people found key elements up to 4x faster in the expressive versions of the same apps. Styling
  that clarifies nothing is noise.
- **One focal point per screen.** Build each screen around a single primary goal. Everything else
  steps down in size, color role, shape and type weight so the eye has an obvious place to land.
- **Seven tactics, each an independent dial.** Shape, color, typography, containment, motion,
  component flexibility, and hero moments (which combine the others). Turn up one dial where it helps.
  Don't turn up all of them everywhere.
- **Restraint is part of the system.** Keep one or two hero moments per product, make secondary
  screens quieter, use standard motion for utilitarian products, and leave familiar patterns intact.
  The research also found a sizeable minority of people prefer calmer designs.
- **Everything flows through tokens.** Components read system tokens. Themes, contrast levels, motion
  schemes, fonts and language heights change token values and never rename them. That is why an
  expressive choice keeps working in dark mode, high contrast and reduced motion.
- **Accessibility is the floor, not a tactic.** Contrast ratios, target sizes, focus visibility and
  user settings apply to every expressive treatment. A treatment that breaks them is wrong, however
  striking it looks.
- **On the web you build it yourself.** Material Web is in maintenance mode and does not implement
  Expressive. This skill's token file plus plain CSS and small scripts is the web path.

## What M3 Expressive is

Google announced M3 Expressive on May 13, 2025, as a package of new features, refreshed components and
design tactics for UX with emotional impact. The launch post calls it an evolution of M3. Other pages
(Get Started, the Android developer docs) call it an expansion, and the 2026 Compose-first post calls it
an opt-in "expansion pack". All sources agree on three points: M3 is not deprecated, there is no "M4",
and adopting Expressive means choosing extra options, not migrating off M3.

| Generation / update | When | What it is known for |
|---|---|---|
| Material Design (M1) | 2014 | The original system |
| Material Design 2 | 2018 | Material Theming |
| Material 3 | 2021 | Material You, dynamic color |
| M3 Expressive launch | May 13, 2025 | Seven tactics, spring motion, emphasized type, shape library, new corner sizes, 14 new or updated components (the Get Started page says 15). The color page dates tokenized contrast levels to the same month but does not call them an Expressive change |
| Expressive layout | May 19, 2026 (I/O 2026) | Layout scaffold (bars, rails, panes), 8dp spacing tokens, "window size classes" renamed breakpoints, "responsive" renamed adaptive |
| Language height | Aug 2026 | Taller line heights for taller scripts |

Background: a 2022 study of how people felt about Material in Google's own apps raised the question of
why so many apps looked alike. About three years of design and research rounds followed. The launch
was tied to Android 16 and Wear OS 6, rolling out on Pixel devices first later in 2025.

Naming traps to avoid:

- **`Variant.EXPRESSIVE` / `SchemeExpressive`** in Material Color Utilities is a dynamic-color scheme
  variant that predates M3 Expressive (its source file dates from 2022). It is unrelated to the design
  language, and an expressive UI does not need it.
- **Compose `MaterialExpressiveTheme`** changes only the motion scheme (to expressive) and four
  light-theme on-container colors (to tone 30). It keeps the default shapes and typography. An
  "expressive theme" in code is not the design language: the tactics are design decisions, not a switch.
- **Tone-30 on-container colors** (light `on-primary-container` = `#4F378B`) date from Aug 2024 and are
  the current M3 baseline, which the shipped token file uses. They are not an Expressive-only option.

## Research evidence

Google calls M3 Expressive the most researched update to Material since its 2014 launch. Each row
names its source. The M3 launch post and the design.google research article were published the same
day, and the article has the detail.

| Finding | Exact figure | Source |
|---|---|---|
| Scale of the program | 46 research studies, hundreds of designs, more than 18,000 participants worldwide | M3 blog, design.google |
| Methods | Eye tracking; surveys and focus groups; preference experiments; usability tests of how quickly people understood and used a screen. Component studies came first (progress indicators, how large a button can get, the floating toolbar). Many of the tested designs went beyond the standards for tap-target size and color contrast | design.google |
| Preference | Favored by every age group (net positive); strongest among 18–24-year-olds, up to 87% | design.google |
| Emotional attributes | Rated higher for energetic, emotive, positive vibe, creative, playful, friendly | design.google, M3 blog |
| Desirability (framework of Warren et al., 2019) | +32% subculture perception, +34% modernity, +30% rebelliousness | design.google |
| Switching | Participants were more likely to switch to products built with M3 Expressive components and techniques (no figure published) | M3 blog |
| Speed | 10 apps, each tested in an expressive and a current-M3 version in random order with eye-tracking glasses: key UI elements found up to 4x faster, and the time to tap key actions fell by seconds | design.google (4x also in the M3 blog) |
| Email case | A larger Send button placed just above the keyboard in a secondary color was found 4x faster than a small Send icon in the top app bar | design.google |
| Age | Differences in fixation time between age groups largely disappeared; participants aged 45+ did as well as younger ones | design.google |
| Abilities | Participants with a range of movement and vision abilities rated the expressive versions more appealing, intuitive and easy to use (larger buttons, high-contrast containment) | design.google |

What failed is as instructive as what worked:

- A playlist rebuilt as album art scattered across the screen looked modern, but usability scores
  dropped and testers did not recognize it as a playlist.
- Removing text labels from email actions lowered usability.
- Unfamiliarity dampened the results. Google expects that to fade as more apps adopt the style.
- A strong minority preferred calmer, less intense versions of the designs.

The lesson is to make key actions bigger, better placed and differently colored, while keeping labels
and familiar structures and offering calm where people want it.

Earlier context: a May 2024 M3-vs-M2 study (229 US participants, email app) found M3 ahead on
hierarchy (81% attention, 92% informative) and utility (77% obvious to use, 76% clearer main
function), and on creativity and personality (63% each). But 65% rated M2 as more playful, which the
team put down to its colorful top app bar. Our reading, not Google's: that playfulness gap is the
backdrop for Expressive.

Conflicting figures: the Android Wear version of the research essay says "dozens" of studies and
"tens of thousands" of participants, and adds about a 100% preference gain and up to a 170% aesthetics
gain without study details. Use 46 studies and 18,000+ participants (two primary sources, same day).
Treat the Wear-only percentages as unverified.

## What changed, by foundation

| Foundation | New or changed with Expressive | Date | Tokens and helpers in the shipped file | Reference |
|---|---|---|---|---|
| Motion | Spring physics system with two preset schemes (expressive, standard), spatial vs effects springs, fast/default/slow speeds. The easing-and-duration system stays for transitions and not-yet-migrated products but is no longer maintained | May 2025 | Tokens: `--md-sys-motion-spring-<speed>-<type>-damping` / `-stiffness`. Helpers: web curves in `--m3e-motion-spring-*` | `motion.md` |
| Typography | 15 emphasized styles next to the unchanged 15 baseline styles; a Variable font context (Roboto Flex) in the token data, although the typography page still says Roboto Flex is not yet in the type scale; language-height line heights | May 2025; language height Aug 2026 | Tokens: `--md-sys-typescale-emphasized-*`, `--md-ref-typeface-<role>-line-height` | `typography.md` |
| Shape | 35-shape library with built-in morphing; new corner sizes large-increased 20px, extra-large-increased 32px, extra-extra-large 48px; `full` redefined (no longer "50% of the size") | May 2025 | Tokens: `--md-sys-shape-corner-*`, `--md-sys-shape-corner-value-*`. Helpers: `--m3e-shape-*` | `shape.md` |
| Color | No new roles. Guidance on mixing accent roles and surface tones. Standard/medium/high contrast levels were tokenized the same month (the color page does not label this Expressive; contrast themes existed since 2023) | May 2025 | Contrast blocks behind `data-contrast`. Helpers: `--m3e-scrim`, `--m3e-scrim-opacity` | `color.md` |
| Layout | Scaffold of bars, rails and panes; 8dp spacing tokens; breakpoints (previously window size classes); adaptive (previously responsive) design | May 2026 | Tokens: `--md-sys-measurement-space*`. Helpers: `--m3e-breakpoint-*`, `--m3e-window-margin` and `-margin-*`, `--m3e-pane-spacer`, `--m3e-fixed-pane-width-*`, `--m3e-side-sheet-max-width` | `layout.md` |
| Elevation | No Expressive change | — | Tokens: `--md-sys-elevation-level0..5`. Helpers: `--m3e-elevation-shadow-level0..5` (box-shadow), `--m3e-elevation-drop-shadow-level0..5` (filter, for clipped shapes) | `elevation.md` |
| Interaction states | No Expressive change (a `disabled` opacity token was added in Nov 2025) | — | Tokens: `--md-sys-state-*`. Helpers: `--m3e-focus-indicator-color`, `--m3e-state-layer-size`, `--m3e-min-target-size`, `--m3e-state-disabled-container-opacity` | `interaction-states.md` |
| Token contexts | Motion scheme and Font groups (created Aug 2024), Contrast (Apr 2025), Language height (Jul 2026) | 2024–2026 | Switch attributes, see below | this file |

## The seven expressive tactics

Google set down these tactics as its own apps adopted the new features, to steer attention to what
matters most on a screen. Treat each one as a separate axis: you can turn it up for one component,
one layout or the whole product. This list of seven, from the launch post, is the canonical set. Other
pages group the ideas differently: design.google names five basic ingredients (color, shape, size,
motion, containment), and the Usability page lists six headings. Size is not one of the seven, but
Material's usability guidance ties importance directly to size (the main action should be the largest
action on the screen), so it runs through tactics 1, 4 and 7.

| # | Tactic | What it does | Main tokens and helpers | Guardrail |
|---|---|---|---|---|
| 1 | Use a variety of shapes | Silhouette sets tone at a glance; round-vs-sharp contrast pulls focus | `--md-sys-shape-corner-*`, `--m3e-shape-*` | Never make an essential action small or weak in shape |
| 2 | Apply rich and nuanced colors | Accent roles and surface tiers separate what matters from what supports | `--md-sys-color-{primary,secondary,tertiary}[-container]`, `--md-sys-color-surface-container-*` | Similar roles side by side blend together |
| 3 | Guide attention with typography | Weight, size and spacing single out the headline, key figure or action | `--md-sys-typescale-emphasized-*`, the display/headline roles | Emphasis everywhere means no emphasis |
| 4 | Contain content for emphasis | Groups make structure readable; the key group gets the most room and the brightest surface | Surface-container roles, `--md-sys-color-surface-bright`, corner tokens, `--md-sys-measurement-*` | Loose, ungrouped items blend together |
| 5 | Add fluid and natural motion | Springs and shape morphs make interaction feel physical and responsive | `--m3e-motion-spring-*`, `--md-sys-motion-spring-*` | Use sparingly; honor reduced motion |
| 6 | Leverage component flexibility | Controls move and resize with context and screen size | `--m3e-breakpoint-*`, layout helpers | The same action must stay recognizable |
| 7 | Combine tactics to create hero moments | Several tactics at once make one short, memorable, focused moment | All of the above | One or two per product |

### 1. Use a variety of shapes

- Keep the surrounding UI on one corner family, then give the single focal element a shape that
  breaks from it. Examples: a library shape such as `--m3e-shape-cookie-9-sided` on an avatar, or a
  squarer radius (`--md-sys-shape-corner-large-increased`, 20px) on a primary action among pill-shaped
  siblings.
- Use the larger corner steps (20px, 32px, 48px) for big expressive containers. Mixing rounded and
  sharper shapes creates tension that draws the eye.
- Use library shapes for emphasis, image masks and empty-space fills, not for every container.
- `clip-path` clips focus rings, shadows and the hit area, so clip a child element, never the
  focusable one.

### 2. Apply rich and nuanced colors

- Give the key action the strongest accent (`primary`), supporting actions a container role
  (`secondary-container`), and data or accents a different family (`tertiary`). Contrasting hues are
  easier to tell apart than neighboring ones.
- Build depth with surface tiers (`surface`, `surface-container-low` … `-highest`) instead of shadows
  or arbitrary grays.
- Stay on roles. Custom hex values bypass dark theme and all three contrast levels.

### 3. Guide attention with typography

- Use emphasized styles for the screen's headline, the key number, the primary action label, and
  selected or unread states. In the 3P baseline they change only weight: 400→500 for display,
  headline, title-large and body, and 500→700 for title-medium, title-small and labels.
- For editorial moments, span a wider range of the scale (a display role above body text) and use
  color and spacing, not just weight.
- Decorative or highly expressive faces suit display sizes, and headlines if used carefully. Be wary
  of them in titles, and never use them for body text.

### 4. Contain content for emphasis

- Put related items in one container and separate groups with more space than you use inside a
  group. Spacing alone already signals which items belong together.
- Give the most important group the most room and the brightest surface on the screen. Brightness
  order flips between themes, and `surface-bright` is the only role brighter than
  `surface-container` in both, so put the key group on `surface-bright` over a `surface-container`
  area (on a plain `surface` page it is invisible in light theme, where the two roles share a value).
  Ordinary groups sit on `surface-dim`, the only role darker than `surface-container` in both themes
  (`surface-container-low` is just 1.04:1 from it in light and vanishes). `color.md` has the full brightness order and a
  worked grouped-list (settings) screen that assigns roles to the page, the content region, the groups,
  the key group and the app bar at rest and scrolled.
- Avoid deep nesting. Our rule of thumb: two levels (content region, groups; the page body is not a level) are usually enough,
  and nested containers need different surface roles so the tone step stays visible.
- Rows inside a group can sit closer than the 8px target gap. Full-width rows that tile the group
  without overlapping are adjacent targets, which the spacing rule exempts; each row still needs a 48px
  target (see [Accessibility is the baseline](#accessibility-is-the-baseline)).

### 5. Add fluid and natural motion

- Use spatial springs for position, size, scale, rotation and corner changes (they may overshoot),
  and effects springs for color and opacity (they never overshoot).
- Pick each spring's speed from the size of what moves and how far it travels, never from how
  important it is: fast for small parts and short travel (buttons, switches, chips), default for
  surfaces that cover part of the screen, slow for full-screen changes and long travel. Most motion
  lands on default. See [motion.md: Speed](motion.md#speed-fast-default-slow).
- Use motion sparingly. A hero moment or key interaction earns its emphasis through larger travel, a
  shape morph or the expressive scheme, not through a slower spring; a slow spring on a small control
  only makes it feel sluggish. The scheme decides how much every spatial spring bounces (see the
  motion scheme rules below).
- When one change has a spatial half and an effects half, running both at the same speed is a sensible
  default, not a pass/fail rule. Button color and state-layer changes use fast effects.
- Screen-to-screen navigation uses the legacy easing and duration pairs. A component's own enter and
  exit (a menu opening, a sheet sliding in) may use springs. See
  [motion.md: Transition patterns](motion.md#transition-patterns).
- Morph shape to show state change (pressed, selected, in progress) rather than adding decoration.
- Under reduced motion, replace slides and scales with fades and drop parallax and shape morphing.

### 6. Leverage component flexibility

- Move controls to where the task happens: a primary action near the thumb on compact screens, or
  next to the input it acts on (the email Send button above the keyboard).
- Let layouts reflow across breakpoints (compact < 600px, medium 600px, expanded 840px, large 1200px,
  extra-large 1600px) and let components change form with them, for example a bottom bar becoming a
  side rail.
- Keep the same action looking like itself at every size, so adaptation never costs recognition.

### 7. Combine tactics to create hero moments

- A hero moment stacks several tactics (shape, color, emphasized type, spring motion) on one short,
  high-value moment: completing a goal, starting a core activity, a key figure.
- To find one, ask two questions. Does this moment carry emotional weight? Is it a key interaction
  in the product? If neither, it is not a hero moment.
- While it plays, quiet everything else: lower the emphasis of the surrounding controls and hide
  what is not needed (Material's worked example hides the navigation bar).
- Keep it brief, and limit hero moments to one or two per product.

## Restraint rules

1. **One or two hero moments per product.** More than that and they stop feeling special and start
   competing. Pick the moments tied to the product's core purpose.
2. **Don't stack tactics.** Material's usability guidance warns that piling many tactics onto the same
   screen distracts people. A working rule of our own: if you can't name the one thing a screen
   emphasizes, remove tactics until you can.
3. **Respect familiar patterns.** Lists stay lists, actions keep their text labels, and navigation
   stays where people expect it. The research failures (scattered playlist, unlabeled email actions)
   came from breaking basic interaction patterns.
4. **Functionality first.** Clarity beats flourish every time. If an expressive idea slows a task or
   hides an action, drop it.
5. **Calm variants for utilitarian contexts.** What suits a media player or email app may not suit
   banking. Material's concrete advice is the standard motion scheme for utilitarian products. The
   rest is our extension, not a Material rule: the plain corner scale, baseline type (emphasized only
   for key figures) and fewer accent roles.
6. **Step down across screens.** The hero screen carries the most tactics. Secondary screens use
   fewer and subtler ones, and tertiary screens (history, settings) are quieter still.
7. **Start from user needs and test.** Identify critical journeys before choosing tactics, then use
   usability research to balance freshness against familiarity and playfulness against professionalism.

Matching intensity to context (our synthesis from the research's media-and-email vs banking contrast,
not a Material table):

| Context | Motion scheme | Shape | Color | Type |
|---|---|---|---|---|
| Media, social, personal expression | Expressive | Library shapes for art, avatars and the hero; corner mix for tension | Mix primary, secondary and tertiary; vivid containers | Emphasized display and headline for editorial moments |
| Productivity, messaging, email | Expressive, or standard with expressive swapped in on the key interaction | Corner scale; one contrasting shape on the primary action | Primary for the key action, secondary containers for support | Emphasized for key labels and unread or selected states |
| Finance, health records, admin, dense data | Standard | Uniform corner scale | Primary for the one action, neutral surfaces | Baseline; emphasized only for the key figure |

## Hierarchy around one primary action

A **primary goal** is a task people must complete for the product to do its job, such as starting a
session, sending, paying or deciding. **Secondary and tertiary goals** enrich the experience but are
optional, such as viewing status, history or settings. The primary goal gets the strongest emphasis,
and the others must stay discoverable. Put one primary task on each screen and use empty space to
isolate it.

Work in this order, as the Usability pages do:

1. **Hierarchy first.** Rank everything with color role, size, spacing, placement and containment
   until the primary action clearly wins. Make it the largest action (button or FAB) on the screen:
   Material links larger key actions to faster, more learnable use with fewer errors. Compare it with
   other actions only. Full-width list rows, sliders and form controls are often bigger boxes, but
   they are not competing actions.
2. **Emphasis second.** Only then add the extra flourish (scale, library shapes, shape morph,
   illustration) to celebrate success or progress, for example in a hero moment.

Emphasis ladder (tokens are the usual choices; exact component sizes are on Material's component
pages, https://m3.material.io/components):

| Level | Examples | Size | Color role | Shape | Type | Placement |
|---|---|---|---|---|---|---|
| Primary goal (one per screen) | Start, Send, Pay, Record | Largest action (button or FAB) on the screen; list rows, sliders and form controls don't count | `--md-sys-color-primary` / `--md-sys-color-on-primary` (or `primary-container` for a large surface) | May break from its siblings' shape | `label-large` (baseline or emphasized) on a small button; a larger button may use an emphasized title or headline role | Easiest reach: low on touch screens, next to the content it acts on |
| Secondary | Edit, Share, Filter | Standard | `--md-sys-color-secondary-container` / `--md-sys-color-on-secondary-container` | Shared family | `label-large` baseline | Grouped with the content it affects |
| Tertiary | Settings, Help, Details | Smallest that still keeps a 48×48px target (`--m3e-min-target-size`) | No container; `--md-sys-color-primary` text, or `--md-sys-color-outline` border | Shared family | Baseline | Edges, overflow, secondary screens |
| Data, status | Progress, stats, messages | As content needs | A different role from the screen's actions (secondary or tertiary accents). A screen with no primary action may use `primary` for its key figure, as Aura's progress screen does | Uniform within a group | Emphasized only for the one key figure | Inside containers, evenly spaced |

Material's worked example (the "Aura" breathing app on the Usability pages), restated:

- **Primary goal:** starting a breathing session. It gets an extra-large button in the primary role,
  placed low for easy reach, carrying the largest text.
- **Supporting elements:** settings use secondary colors inside subtle containers. The daily message
  gets the least emphasis.
- **Hero moment:** an animated flower shape from the library with spring motion, very large countdown
  numerals, and a vivid yellow on each inhale against soft purple. During it, the pause and stop
  controls get less emphasis than the flower and the navigation bar hides.
- **Other screens:** the report screen uses fewer tactics, and the progress screen is subtler still,
  with the primary role for key data and secondary roles for progress accents.
- **What the first draft got wrong:** many equally large elements, primary and primary-container on
  everything, ungrouped settings, inconsistent color. The fix grouped the settings, kept one
  extra-large button, and used one consistent secondary color.
- **Motion detail:** keep text spacing stable while a hero shape animates. Type width and arrow
  movement should stay still while the shape moves, so only one thing draws the eye.

## Standard vs expressive choices

Material names a standard and an expressive scheme only for motion. Typography has baseline and
emphasized styles. For the other foundations the "calm" column below is the quieter end of the same
token set, which is our framing.

| Foundation | Calm / standard choice | Expressive choice | How to switch with the shipped file |
|---|---|---|---|
| Motion | Standard scheme: every spatial spring at damping 0.9, so the fast spring overshoots only about 0.15% | Expressive scheme: spatial damping 0.6 (fast) or 0.8 (default, slow), so the fast spring overshoots about 9.5%. Values per speed in the table below | `data-motion-scheme="standard"` / `"expressive"` (file default: expressive) |
| Typography | Baseline styles (e.g. `title-medium` weight 500) | Emphasized styles (`title-medium` 700; display, headline, title-large and body 400→500) | Read `--md-sys-typescale-emphasized-<role>-*` instead of `--md-sys-typescale-<role>-*` |
| Shape | Corner scale none 0px to extra-large 28px, plus full | Adds 20px, 32px and 48px steps, 35 library shapes, shape morph, round-vs-sharp contrast | Choose tokens; library shapes via `--m3e-shape-*` in `assets/material-shapes.css` |
| Color | Primary for the key action on neutral surfaces | Primary, secondary and tertiary mixed for emphasis, with surface tiers for depth | Choose roles; contrast level is a user setting, not an expressive choice |
| Containment | Content on one surface, separated by dividers or space | Grouped containers on tiered surfaces, with the key group given the most room | Choose roles, corner and spacing tokens |
| Layout | One arrangement scaled to the window | Controls and panes that adapt to breakpoints and posture | Media queries at 600, 840, 1200 and 1600px, spelled out because `var()` can't appear in a media condition; `--m3e-breakpoint-*` holds the same values for `calc()` and JS (see `layout.md`) |

Key expressive tokens and helpers at a glance (values from the shipped file; motion helpers in the
expressive scheme unless noted):

| Token or helper | CSS custom property | Value | Use |
|---|---|---|---|
| `md.sys.motion.spring.fast.spatial` | `--md-sys-motion-spring-fast-spatial-damping` / `-stiffness` | 0.6 / 800 (expressive); 0.9 / 1400 (standard) | Small elements, short distances: press, toggle, chip-sized changes |
| `md.sys.motion.spring.default.spatial` | `--md-sys-motion-spring-default-spatial-damping` / `-stiffness` | 0.8 / 380 (expressive); 0.9 / 700 (standard) | Medium elements and distances; surfaces covering part of the screen |
| `md.sys.motion.spring.slow.spatial` | `--md-sys-motion-spring-slow-spatial-damping` / `-stiffness` | 0.8 / 200 (expressive); 0.9 / 300 (standard) | Full-screen changes and long travel |
| helper (official web curve) | `--m3e-motion-spring-fast-spatial` | `350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)`; standard `350ms cubic-bezier(0.27, 1.06, 0.18, 1)` | `transition` shorthand for spatial properties of small elements |
| helper (official web curve) | `--m3e-motion-spring-slow-spatial` | `650ms cubic-bezier(0.39, 1.29, 0.35, 0.98)`; standard `750ms cubic-bezier(0.27, 1.06, 0.18, 1)` | Full-screen or long-travel movement |
| helper (official web curve) | `--m3e-motion-spring-fast-effects` | `150ms cubic-bezier(0.31, 0.94, 0.34, 1)` (both schemes) | Color and opacity of small elements: button color, state layers |
| helper (official web curve) | `--m3e-motion-spring-default-effects` | `200ms cubic-bezier(0.34, 0.8, 0.34, 1)` (both schemes) | Color and opacity of medium surfaces: fades, content inside a panel |
| `md.sys.typescale.emphasized.title-medium.weight` | `--md-sys-typescale-emphasized-title-medium-weight` | 700 (baseline 500) | Key labels, selected or unread titles |
| `md.sys.typescale.emphasized.display-large.weight` | `--md-sys-typescale-emphasized-display-large-weight` | 500 (baseline 400); size 3.5625rem (57px) | Hero numerals, editorial headlines |
| `md.sys.shape.corner.large-increased` | `--md-sys-shape-corner-large-increased` | 20px | Expressive medium containers; a primary action set apart from pills |
| `md.sys.shape.corner.extra-large-increased` | `--md-sys-shape-corner-extra-large-increased` | 32px | Large expressive containers |
| `md.sys.shape.corner.extra-extra-large` | `--md-sys-shape-corner-extra-extra-large` | 48px | Very large hero surfaces |
| `md.sys.shape.corner.full` | `--md-sys-shape-corner-full` | 9999px | Pills and circles (all four corners only) |
| helper (shape library) | `--m3e-shape-<name>` (35 shapes, e.g. `--m3e-shape-sunny`) | CSS `shape()` path | `clip-path` on decorative or media elements |

Motion scheme rules:

- Pick one scheme product-wide, on `<html>`. Swap it only on the element you want to emphasize, and
  document the exception.
- Material recommends expressive for most products and standard for utilitarian ones. The token
  database's default tag and Compose's plain `MaterialTheme` both default to standard. The shipped file
  defaults to expressive because this is an Expressive skill.
- Effects springs (color, opacity) have identical values in both schemes: fast damping 1 / stiffness
  3800, default 1 / 1600, slow 1 / 800.

## Token architecture

A design token pairs a name with a value. The value can be a color, a font, a length, a number, or
another token. Tokens replace hard-coded values with names that say what they are for. The name and
purpose stay stable while the value can change, which lets one edit reach every product and platform.

### Tiers: reference → system → component

| Tier | Token pattern | CSS custom property (example) | Example value | Use |
|---|---|---|---|---|
| Reference | `md.ref.*` | `--md-ref-palette-primary40` | `#6750A4` | The pool of available options (palette tones, typefaces, weights, per-role line heights). Only the theme layer reads these |
| System | `md.sys.*` | `--md-sys-color-primary` | `light-dark(#6750A4, #D0BCFF)` | Named decisions (roles) that give the product its character. Components read these, and theming happens here |
| Component | `md.comp.*` | not shipped | — | Per-component properties (container, label, icon, state). The site marks them as in development and the token export has none. Define your own (see the web section) |

- **Naming:** dots become hyphens and every segment is kept, so `md.sys.color.on-primary-container`
  becomes `--md-sys-color-on-primary-container`. `md` marks Material tokens. `--m3e-*` properties are
  helpers from this skill, not Material tokens: spring curves, box-shadow and drop-shadow elevation,
  scrim and scrim opacity, focus color, state-layer size, minimum target size, disabled container
  opacity, breakpoints, window margins, pane spacer and widths, side-sheet width, and library shapes.
- **Why three tiers:** change a decision once at the system tier and every component follows, or once
  at the component tier to affect only that component.
- **System tokens are not always references.** In the token database, corner radii, spring numbers,
  state opacities, spacing, and type size, line height and tracking are literal values.
- **Composite tokens** exist in the data: `md.sys.typescale.body-medium` bundles font, weight, size,
  tracking and line height, and `md.sys.motion.spring.fast.spatial` bundles damping and stiffness. CSS
  has no composite custom property, so the file exposes the atomic parts. Bundle them in utility
  classes (see the web section).

### Contexts: one name, several values

A context is a condition under which a token takes a non-default value. The token database (DSDB
38.2.9, published 2026-08-10) has nine context groups. The shipped file resolves the build-time ones
and turns the rest into switches.

| Context group | Values in the data | On the web | In the shipped file |
|---|---|---|---|
| Theme | Light (default), Dark | Runtime, OS or user | `color-scheme: light dark` + `light-dark()`; override with `data-theme="light"` / `"dark"` |
| Contrast | Default, Medium, High | Runtime user setting | `data-contrast="standard"` / `"medium"` / `"high"`; OS `prefers-contrast: more` selects high when no attribute is set |
| Motion scheme | Standard (default tag), Expressive | Product decision | `data-motion-scheme="expressive"` / `"standard"`; file default expressive |
| Font | Static (default), Variable, iOS bold | Product decision | `data-typeface="variable"` switches to Roboto Flex with tracking 0 |
| Language height | Small (default), Medium, Large, Extra large | Per content language | `data-language-height="small"` / `"medium"` / `"large"` / `"extra-large"`, or picked from `<html lang>` for listed languages |
| Platform | Android (default), iOS, Web, Compose | Build time | Resolved to Web |
| Audience | 1P Baseline (default; Google's own theme), 3P | Build time | Resolved to 3P (baseline purple `#6750A4`, Roboto) |
| iOS dark theme elevation, iOS weight setting | — | Not applicable | Omitted |

- **Precedence:** each group has a rank, and the stored scores weight them 1, 2, 4, 8 … 256 (theme 1,
  platform 2, audience 4, motion scheme 8, font 16, contrast 32, the two iOS groups 64 and 128, language
  height 256). So a value tagged with a higher group outweighs all lower groups combined. That is our
  reading of the scores; the resolver itself is not published. The file gets the same effect through
  rule order: base values sit on `:root` and contrast blocks follow, so a contrast choice always
  overrides the base values. Because of `light-dark()`, one contrast rule carries both the light and
  the dark value.
- **Right-to-left** is an example context on the design-tokens page, but the data has no RTL group. The
  file handles it with `dir="rtl"`, which mirrors the start/end corner shorthands.
- **Language height** changes only line heights: Small covers Latin (except Vietnamese), Greek,
  Cyrillic and Hebrew. Medium (about 7% taller) covers most other scripts. Large (about 30%) covers
  Burmese and Telugu, and Extra large (about 100%) covers Nastaliq. Material suggests Medium when the
  language is unknown. The data's default tag is Small, and so is the file's. Keep Small for a
  Latin-script product, and set `data-language-height="medium"` only when the content language is
  unknown (user-generated text, for example). A block that mixes scripts takes the category of its
  tallest script, so Medium would clip Burmese or Telugu lines (see
  [typography.md: Language height](typography.md#language-height)).

## How the shipped CSS file maps to the architecture

`assets/m3-expressive-tokens.css` holds every token on `:root`, generated from the DSDB (3P audience,
Web platform).

| File section | Tier | Properties | Switched by |
|---|---|---|---|
| Reference palettes | ref | `--md-ref-palette-<family><tone>` (key palettes plus static hue palettes) | — |
| Typefaces | ref | `--md-ref-typeface-brand`, `--md-ref-typeface-plain`, `--md-ref-typeface-weight-{regular,medium,semibold,bold}`, `--md-ref-typeface-<role>-line-height` | `data-typeface`, `data-language-height`, `lang` |
| Type scale | sys | `--md-sys-typescale-<role>-{font,weight,size,line-height,tracking}` and `--md-sys-typescale-emphasized-<role>-*` | `data-typeface`, `data-language-height`, `lang` |
| Shape | sys | `--md-sys-shape-corner-*`, `--md-sys-shape-corner-value-*` | `dir` (start/end shorthands) |
| Spacing | sys | `--md-sys-measurement-space0` … `--md-sys-measurement-space900` | — |
| Elevation | sys | `--md-sys-elevation-level0` … `level5` (0, 1, 3, 6, 8, 12px) | — |
| States | sys | `--md-sys-state-*-state-layer-opacity`, `--md-sys-state-focus-indicator-*` | — |
| Springs | sys | `--md-sys-motion-spring-<speed>-<type>-damping` / `-stiffness` | `data-motion-scheme` |
| Legacy motion | sys | `--md-sys-motion-easing-*`, `--md-sys-motion-duration-*`, `--md-sys-motion-path` | — |
| Color roles | sys | `--md-sys-color-*` | `data-theme`, `data-contrast`, OS color scheme and contrast |
| Helpers | — | `--m3e-*`: spring curves and `linear()` traces; `--m3e-elevation-shadow-level0..5` and `--m3e-elevation-drop-shadow-level0..5`; `--m3e-scrim`, `--m3e-scrim-opacity`; `--m3e-focus-indicator-color`; `--m3e-state-layer-size` (40px), `--m3e-min-target-size` (48px), `--m3e-state-disabled-container-opacity` (0.1); breakpoints, window margins, pane spacer, fixed pane widths, `--m3e-side-sheet-max-width` (400px); library shapes in `assets/material-shapes.css` | `data-motion-scheme` and reduced motion (spring curves); width ≥ 600px (`--m3e-window-margin`, 16px → 24px) |

Deliberately not shipped: the spring composite tokens (the `--m3e-motion-spring-*` helpers stand in),
the deprecated `surface-tint-color` aliases, `md.sys.glass.*` (iOS only), first-party Google values, the
per-axis variable-font tokens, and the DSDB-only "Type scale - Variable" sets (use
`font-optical-sizing: auto` instead of their `opsz` values).

Cascade rules that decide how you override things:

- **Color roles are resolved literals.** `--md-sys-color-primary` holds `light-dark(#6750A4, #D0BCFF)`,
  not `var(--md-ref-palette-primary40)`. Overriding a palette tone changes nothing on screen. Override
  the role itself.
- **Type tokens reference typefaces through `var()`**, which resolves on the element that declares it
  (`:root`). Override `--md-ref-typeface-brand` / `--md-ref-typeface-plain` (or the `weight-*` tokens)
  on `:root` to change the whole product. On a subtree, override the `--md-sys-typescale-*` tokens
  themselves.
- **Helpers that read roles resolve at `:root` as well.** `--m3e-focus-indicator-color`
  (`var(--md-sys-color-secondary)`), `--md-sys-color-surface-tint`, `--m3e-scrim` and both shadow
  families (`--m3e-elevation-shadow-*`, `--m3e-elevation-drop-shadow-*`) do not follow a role override
  on a subtree. Re-declare them in the same rule when they should.
- **Corner tokens are literals.** `--md-sys-shape-corner-*` does not point at
  `--md-sys-shape-corner-value-*`, so remapping the shape scale means overriding both families.
- **`light-dark()` resolves where the color is used**, so `data-theme` works on any subtree.
- **Every switch attribute works on a subtree** (`data-theme`, `data-contrast`, `data-motion-scheme`,
  `data-language-height`, `data-typeface`). The OS-driven defaults (`prefers-contrast`, language
  height from `lang`) apply at the root only.
- **Older browsers:** colors use `light-dark()` (Chrome 123, Firefox 120, Safari 17.5). Browsers without
  it get plain light and dark values at standard contrast only.

## Theming and customization

Material's aim for customization is a clearly branded product that still keeps familiar
patterns and accessible interactions. Dynamic color does the heavy lifting: one source color becomes
five tonal palettes (primary, secondary, tertiary, neutral, neutral variant), and the palettes fill the
roles with accessible pairings built in.

- **Theme at the system tier.** Components never change when the brand changes, only `--md-sys-*`
  values do.
- **Generate, don't hand-pick.** Create a scheme from one brand color with Material Color Utilities
  (code in `color.md`). Write every role for light and dark and for all three contrast levels. In the
  static baseline, surfaces stay the same at every contrast level. A generated scheme can shift them
  (MCU's default 2021 spec does), so don't copy only the baseline's contrast-varying roles.
- **Keep a fallback.** Always ship a static scheme (baseline or brand) and treat user-generated color
  as a layer on top. It can apply to one region only, such as a profile page themed from the user's
  photo.
- **No wallpaper hook on the web.** The CSS `AccentColor` system color is not a reliable seed: Chrome
  returns a fixed value outside installed web apps, and Safari only supports a fallback. Seed from a
  brand color, a user-picked color or an image.
- **Harmonize extra colors.** Semantic colors (success, warning) become extended colors whose hue is
  nudged toward the source color within a limit, so they still read as green or amber.
  `scripts/generate-scheme.mjs --custom` writes them as product tokens (`--app-color-<name>`,
  `--app-color-on-<name>`, `--app-color-<name>-container`, `--app-color-on-<name>-container` by
  default) with standard, medium and high contrast values, never under `--md-*` or `--m3e-*`.
- **Fonts:** swap `--md-ref-typeface-brand` / `--md-ref-typeface-plain` on `:root`. Roboto (static) and
  Roboto Flex (variable) are the 3P defaults. Google Sans is Google's own brand face, so don't default
  to it.
- **Shape and motion personality:** remap corner values at the system tier so every component
  follows, not per component (override both corner families, as noted above). Choose a motion
  scheme, or define a custom one with your own damping and stiffness values, keeping the
  spatial/effects split. On the web, a custom scheme also needs its own curve helpers, because the
  shipped `--m3e-motion-spring-*` curves are precomputed for the two official schemes.
- **Contrast is the user's choice.** Medium and high contrast serve vision needs and are never a brand
  decision. Every custom scheme must supply them.

## Accessibility is the baseline

Material's accessibility principles set the tone: let individuals customize (needs change over a day
and a lifetime), learn from people with a range of abilities before designing rather than after, and
treat WCAG minimums as a starting point, not a finish line. The Expressive research points the same
way: many tested designs went past the standards for target size and contrast, the expressive
versions largely closed the age gap in how fast people spotted key elements, and participants with a
range of movement and vision abilities rated them easier to use (larger buttons, high-contrast
containment).

| Requirement | Value | Tokens and helpers |
|---|---|---|
| Text contrast | ≥ 4.5:1 for body text; ≥ 3:1 for large text (18pt regular or 14pt bold and up) and meaningful graphics; disabled states exempt | Use role pairs (`primary` / `on-primary` …). A tone difference of 40 guarantees at least 3:1 (3.17:1), and 50 gives about 4.5:1 (4.48:1 minimum) |
| Grouped controls | Containers of adjacent non-text elements (e.g. a row of buttons) ≥ 3:1 against the background | Container roles on surfaces |
| Target size | Touch ≥ 48×48px; pointer-only ≥ 44×44px; ≥ 8px between separate targets. Adjacent targets that tile a container without overlapping (list rows, segments, connected button groups) are exempt from the gap (WCAG 2.5.8's spacing exception, which asks for space only around undersized targets), but each one still meets 48px | `--m3e-min-target-size` (48px helper) for the size, `--md-sys-measurement-space100` (8px) for the gap; `--m3e-state-layer-size` (40px helper) for a small control's circular state layer inside the target |
| Focus | A visible focus ring on every element that takes keyboard focus | `--md-sys-state-focus-indicator-thickness` 3px, `-outer-offset` 2px, `-inner-offset` -3px; `--m3e-focus-indicator-color` (secondary role) |
| Keyboard flow | Tab moves between controls, arrow keys within a composite control, Enter activates; set initial focus per screen; return focus to the trigger when a dialog closes | — |
| Contrast levels | Support standard, medium and high | `data-contrast`; OS `prefers-contrast: more` maps to high |
| Reduced motion | Subtle fades instead of sliding or scaling; no parallax or shape morphing | File: spatial `--m3e-motion-spring-*` helpers become `1ms linear`, effects keep their curves. JS springs must check `matchMedia` |
| Language height | Taller scripts get taller line heights; text never clips | `lang` / `data-language-height`; avoid fixed heights on text boxes |
| Structure | Semantic elements; DOM order = reading order; one `h1`, no skipped levels; one `main`, `banner` and `contentinfo`; labeled repeated landmarks; labels on icon-only controls without role words | — |

An expressive treatment never lowers these values. If a vivid color pairing fails contrast, move to the
next role or contrast level. Don't lighten text to "soften" a hero.

## Platform status on the web

As of September 2026:

| Platform | M3 Expressive status |
|---|---|
| Material Web (`@material/web`) | Maintenance mode: the library is not being updated. The develop/web page states that M3 Expressive is not implemented on web. The roadmap's shape and motion token items describe what used to be planned, and no future work is planned |
| Typography availability table | Web: available (baseline). Web Expressive: unavailable |
| Motion platform table | Web: "Compatible". Use springs when you can; otherwise use curves that mimic them for animations without gestures or interruptions. The site publishes an official cubic-bezier + duration table, which the `--m3e-motion-spring-*` helpers carry |
| Spacing tokens | Listed for Jetpack Compose only. The file exposes the DSDB values as an unofficial web mapping |
| Shape library and morph | Not available on web. The file ships CSS `shape()` clip paths (Chrome 135+, Firefox 148+, Safari 18.4+) with an SVG fallback |
| Angular Material | Implements M3, not Expressive, and may differ from the guidelines |
| Jetpack Compose | Material3 1.4.0 is stable. Expressive APIs are in 1.5.0-alpha29 (Sept 23, 2026) and due to go stable with 1.5.0 later in 2026. Android is now Compose-first |
| MDC-Android (Views) 1.14.0 | Brings Expressive themes, an expressive list, the emphasized type scale and expressive styles for 11 components to Views. It is the final stable release, and Views is now in maintenance mode |

The Get Started page still says web components are "in development". That is stale.

What this means in practice: implement the foundations directly in CSS with the shipped tokens. If a
project also uses Material Web components, the `--md-sys-color-*`, `--md-sys-typescale-*` (font,
size, line height, weight; Material Web documents no tracking token), `--md-sys-shape-corner-*` and
`--md-ref-typeface-*` names match what they read, so they follow the theme. They do not read
`--md-ref-palette-*` or any motion token, and they have no emphasized styles.

## Applying it on the web

### Setup

```html
<!doctype html>
<html lang="en" data-motion-scheme="expressive">
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/assets/m3-expressive-tokens.css">
  <!-- Only if you use library shapes: -->
  <link rel="stylesheet" href="/assets/material-shapes.css">
</head>
```

For an offline or single-file page, self-host Roboto with `@font-face` instead of the Google Fonts
link, and include a real 500 weight: without it the baseline and emphasized styles look the same (see
`typography.md`).

Omit `data-theme` and `data-contrast` to follow the OS. Set them only when the user picks a value in
your settings (`color.md` has an Appearance settings pattern for the controls).

```js
// Apply the user's choices. Removing data-theme or data-contrast falls back to the OS preference;
// removing data-motion-scheme falls back to the file default (expressive).
const root = document.documentElement;
export function applyPrefs({ theme, contrast, motionScheme }) {
  if (theme) root.dataset.theme = theme; else delete root.dataset.theme;             // 'light' | 'dark'
  if (contrast) root.dataset.contrast = contrast; else delete root.dataset.contrast; // 'standard' | 'medium' | 'high'
  if (motionScheme) root.dataset.motionScheme = motionScheme;                        // 'expressive' | 'standard'
  else delete root.dataset.motionScheme;
}
```

### Base styles and type utilities

CSS has no composite type token, so bundle each role's five parts once and reuse the class.

```css
body {
  margin: 0;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font);
  font-weight: var(--md-sys-typescale-body-large-weight);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}

.type-headline-large-emphasized {
  font-family: var(--md-sys-typescale-emphasized-headline-large-font);
  font-weight: var(--md-sys-typescale-emphasized-headline-large-weight);
  font-size: var(--md-sys-typescale-emphasized-headline-large-size);
  line-height: var(--md-sys-typescale-emphasized-headline-large-line-height);
  letter-spacing: var(--md-sys-typescale-emphasized-headline-large-tracking);
}
```

### One primary action, stepped-down supporting actions

The point is the relative step between levels, not the exact sizes. Every action keeps the 48px
minimum target from `--m3e-min-target-size`, padding comes from the spacing tokens, and the primary
action's 64px height is illustrative (component value); take real button sizes from Material's
component pages. Hover, focus and press state layers are covered in `interaction-states.md`.

```css
.action {
  min-block-size: var(--m3e-min-target-size);           /* 48px minimum target (helper) */
  min-inline-size: var(--m3e-min-target-size);
  padding-inline: var(--md-sys-measurement-space300);   /* 24px */
  border: 0;
  border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font);
  font-weight: var(--md-sys-typescale-label-large-weight);
  font-size: var(--md-sys-typescale-label-large-size);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  cursor: pointer;
}
.action:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}

/* Primary: the largest action, strongest role, emphasized label, and a shape that breaks from the pills.
   At this size a title role is fine for the label; small buttons stay on label-large. */
.action--primary {
  min-block-size: 64px;                                 /* illustrative (component value) */
  padding-inline: var(--md-sys-measurement-space500);   /* 40px */
  border-radius: var(--md-sys-shape-corner-large-increased);  /* 20px */
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  font-family: var(--md-sys-typescale-emphasized-title-medium-font);
  font-weight: var(--md-sys-typescale-emphasized-title-medium-weight);
  font-size: var(--md-sys-typescale-emphasized-title-medium-size);
  line-height: var(--md-sys-typescale-emphasized-title-medium-line-height);
  letter-spacing: var(--md-sys-typescale-emphasized-title-medium-tracking);
  /* A button is a small control: fast spatial for the corner morph, fast effects for its color. */
  transition: border-radius var(--m3e-motion-spring-fast-spatial),
              background-color var(--m3e-motion-spring-fast-effects);
}
/* Shape change on press: a small, physical response on the one key action. */
.action--primary:active:not(:disabled, [aria-disabled="true"]) {
  border-radius: var(--md-sys-shape-corner-medium);     /* 12px */
}

.action--secondary {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.action--tertiary {
  background-color: transparent;
  color: var(--md-sys-color-primary);
}

/* Keep the primary action within easy reach at the bottom of the screen's column. */
.screen {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
  padding-inline: var(--m3e-window-margin);
}
.screen__actions {
  margin-block-start: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--md-sys-measurement-space100);   /* 8px between targets */
  padding-block: var(--md-sys-measurement-space200);
}
```

### Containment: grouped content, one key group

```css
/* The area holding the groups sits on surface-container so a brighter group can stand out. */
.groups {
  display: grid;
  gap: var(--md-sys-measurement-space300);   /* 24px between groups */
  padding: var(--md-sys-measurement-space200);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}
.group {
  display: grid;
  gap: var(--md-sys-measurement-space25);    /* 2px between rows: tiling rows are exempt from the 8px target gap */
  padding: var(--md-sys-measurement-space100);
  border-radius: var(--md-sys-shape-corner-extra-large);
  background-color: var(--md-sys-color-surface-dim);   /* 1.22:1 light / 1.14:1 dark against the region */
}
/* Each interactive row is still a full 48px target. */
.group__row {
  min-block-size: var(--m3e-min-target-size);
}
/* The key group: more room and the brightest surface in both themes
   (N98 over N94 in light, N24 over N12 in dark). */
.group--key {
  padding: var(--md-sys-measurement-space300);
  background-color: var(--md-sys-color-surface-bright);
}
```

The 2px gap is fine for rows because they tile the group edge to edge without overlapping, and
adjacent targets like these are exempt from the 8px spacing rule. Separate targets that float apart
(a row of buttons, icons in a toolbar) still need 8px. When each row carries its own fill and corners
(a segmented list), `shape.md` gives the skill's default inner corners and gap, and `color.md` shows the
roles for a full grouped-list screen.

### A hero moment

Shape, color, emphasized display type and a spring entrance, used once. The figure covers part of the
screen, so both halves of the entrance run at default speed. The emphasis comes from the library
shape, the color, the display type and the expressive scheme's bounce, not from a slower spring. The
spatial helper becomes `1ms linear` under reduced motion while the opacity fade keeps its curve, so
this degrades to a fade without extra code.

```css
.hero-figure {
  inline-size: min(18rem, 70vw);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  clip-path: var(--m3e-shape-sunny);   /* decorative element: not focusable */
  font-family: var(--md-sys-typescale-emphasized-display-large-font);
  font-weight: var(--md-sys-typescale-emphasized-display-large-weight);
  font-size: var(--md-sys-typescale-emphasized-display-large-size);
  line-height: var(--md-sys-typescale-emphasized-display-large-line-height);
  letter-spacing: var(--md-sys-typescale-emphasized-display-large-tracking);
  font-variant-numeric: tabular-nums;
  opacity: 0;
  scale: 0.6;
  transition: scale var(--m3e-motion-spring-default-spatial),
              opacity var(--m3e-motion-spring-default-effects);
}
.hero-figure.is-visible {
  opacity: 1;
  scale: 1;
}
/* While the hero plays, the chrome steps back. */
.is-hero-playing .app-nav {
  visibility: hidden;
}
```

The same entrance driven from JS. Reading the helper values keeps the reduced-motion collapse, but
any code that computes springs from `--md-sys-motion-spring-*-damping` / `-stiffness` gets no such
help, so test the media query as well:

```js
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
// animate() throws on an easing the browser can't parse, so fall back to the official curve
// where linear() is missing (before Chrome 113, Firefox 112, Safari 17.2).
const traces = CSS.supports('transition-timing-function', 'linear(0, 1)');

export function playHero(el) {
  const cs = getComputedStyle(el);
  const read = (name) => cs.getPropertyValue(name).trim();
  const spring = (name) => {
    const base = `--m3e-motion-spring-${name}${traces ? '-linear' : ''}`;
    return { duration: parseFloat(read(`${base}-duration`)), easing: read(`${base}-easing`) };
  };
  // Opacity is an effects change: allowed under reduced motion.
  el.animate([{ opacity: 0 }, { opacity: 1 }], { ...spring('default-effects'), fill: 'forwards' });
  // Scale is spatial: jump straight to the end state when the user asks for less motion.
  el.animate([{ scale: 0.6 }, { scale: 1 }], reduceMotion.matches
    ? { duration: 0, fill: 'forwards' }
    : { ...spring('default-spatial'), fill: 'forwards' });
}
```

### Calm product, expressive moment

A utilitarian product sets standard motion globally and opts one element in:

```html
<html lang="en" data-motion-scheme="standard">
  …
  <section class="goal-complete" data-motion-scheme="expressive">…</section>
</html>
```

### Re-theming a region

Colors are resolved literals, so a themed region redeclares the roles themselves. The values below are
Material Color Utilities output (`SchemeTonalSpot`, source `#1B6D5A`, standard contrast). Generate the
full role set the same way (`color.md` has a generator that takes a scope), plus medium and high
contrast sets under `[data-contrast="medium"] .profile-theme, .profile-theme[data-contrast="medium"]`
and the same pattern for `high`. Repeat the high set inside `@media (prefers-contrast: more)` for
`:root:not([data-contrast]) .profile-theme`. Without these, the region drops the user's contrast
choice. Browsers without `light-dark()` keep the baseline colors in the region.

```css
@supports (color: light-dark(#000, #fff)) {
  .profile-theme {
    --md-sys-color-primary: light-dark(#0F6B57, #86D6BE);
    --md-sys-color-on-primary: light-dark(#FFFFFF, #00382C);
    --md-sys-color-primary-container: light-dark(#A2F2D9, #005141);
    --md-sys-color-on-primary-container: light-dark(#005141, #A2F2D9);
    --md-sys-color-secondary-container: light-dark(#CDE9DE, #344C44);
    --md-sys-color-on-secondary-container: light-dark(#344C44, #CDE9DE);
    --md-sys-color-tertiary: light-dark(#416277, #A9CBE2);
    --md-sys-color-surface-container: light-dark(#E9EFEB, #1B211F);
    /* …and every remaining role. */
    /* Helpers that read roles resolve where declared, so re-declare them here too. */
    --md-sys-color-surface-tint: var(--md-sys-color-primary);
    --m3e-focus-indicator-color: var(--md-sys-color-secondary);
  }
}

/* A product-wide font swap works on :root because the type tokens resolve there. */
:root {
  --md-ref-typeface-brand: "Roboto Serif", "Noto Serif", serif;
}
```

### Your own component tokens

Give your components a tier of their own that points at system tokens. Use your own prefix: `--md-*`
is Material's and `--m3e-*` is this skill's.

```css
.stat-card {
  --app-stat-card-container-color: var(--md-sys-color-surface-container-high);
  --app-stat-card-content-color: var(--md-sys-color-on-surface);
  --app-stat-card-value-color: var(--md-sys-color-tertiary);
  --app-stat-card-shape: var(--md-sys-shape-corner-extra-large);
  padding: var(--md-sys-measurement-space200);
  border-radius: var(--app-stat-card-shape);
  background-color: var(--app-stat-card-container-color);
  color: var(--app-stat-card-content-color);
}
.stat-card__value {
  color: var(--app-stat-card-value-color);
}
/* A variant changes a few decisions and keeps role pairs intact; the system stays untouched. */
.stat-card--highlight {
  --app-stat-card-container-color: var(--md-sys-color-tertiary-container);
  --app-stat-card-content-color: var(--md-sys-color-on-tertiary-container);
  --app-stat-card-value-color: var(--md-sys-color-on-tertiary-container);
}
```

## Do and don't

- **Do** decide each screen's one primary goal before styling anything. **Don't** give several
  actions the same size and role, because the eye then has nowhere to land (the first Aura draft's
  failure).
- **Do** give actions and data separate color roles. **Don't** paint everything `primary` or
  `primary-container`, because the key action stops standing out.
- **Do** keep text labels and familiar structures (lists, tabs, navigation placement). **Don't** turn a
  list into a collage or strip labels to look cleaner. Both lowered usability in Google's tests.
- **Do** reserve hero treatment for one or two moments with emotional weight or core value. **Don't**
  add hero treatment to settings, forms or routine flows, where it only slows people down.
- **Do** set one motion scheme on `<html>` and swap it only on the element you are emphasizing.
  **Don't** mix schemes component by component, because motion then feels inconsistent.
- **Do** tone a utilitarian product down (standard motion, uniform shapes, baseline type). **Don't**
  apply maximum expressiveness to banking or admin screens, where it undermines trust and speed.
- **Do** choose a spring's speed from the size of what moves and how far it travels. **Don't** slow a
  spring down to mark importance, because a slow small control feels sluggish; emphasize with travel,
  a shape morph or the expressive scheme instead.
- **Do** read `--md-sys-*` tokens and `--m3e-*` helpers (or your own component tokens built on them) in
  component CSS. **Don't** hard-code hex or px values where a token or helper exists, or read
  `--md-ref-*` directly, because theme, contrast and scheme switches then cannot reach the component.
- **Do** override `--md-sys-color-*` roles to re-theme. **Don't** override `--md-ref-palette-*` and
  expect colors to change, because the shipped color roles are literals.
- **Do** keep essential actions large. **Don't** put them in shapes smaller than the elements around
  them, because a smaller shape reads as less important.
- **Do** clip a child element with a library shape. **Don't** clip the focusable element, because
  `clip-path` cuts off its focus ring and hit area.
- **Do** gate script-driven and decorative motion on `prefers-reduced-motion`. **Don't** assume the CSS
  helpers cover it, because they cannot reach JS springs, keyframes with literal durations or parallax.

## Auditing

1. Does each screen have exactly one visually dominant primary action (the largest action, meaning
   button or FAB, with the strongest role, easiest to reach)? List rows, sliders and form controls
   don't count in the size comparison. Fail if two or more actions compete at the same size and
   emphasis.
2. Do supporting actions step down visibly (secondary container or no container, smaller, baseline
   type)?
3. Does the product have at most two hero moments, each on a key or emotionally meaningful
   interaction, with secondary and tertiary screens using fewer tactics?
4. Does every screen still have one clear focal point? Fail if a screen stacks tactics at full
   strength (several accent colors, mixed shapes, emphasized type everywhere, bouncing motion) with
   nothing standing out.
5. Are familiar patterns intact: lists look like lists, actions have text labels, and navigation is
   where people expect it?
6. Do component styles read only `--md-sys-*` tokens, `--m3e-*` helpers or the product's own tokens,
   with no `--md-ref-*` references and no raw hex or px values where a token or helper exists?
7. Do light/dark, all three contrast levels and both motion schemes work by switching attributes, with
   no per-theme component CSS?
8. Is one motion scheme set product-wide, with any exception limited to the emphasized element, and
   does each spring's speed follow the size and travel of what moves rather than its importance?
9. Under `prefers-reduced-motion: reduce`, do slides and scales become fades, and are parallax and
   shape morphing (including JS-driven motion) turned off?
10. Do all expressive treatments still meet the floor: text contrast ≥ 4.5:1 (large text and graphics
    ≥ 3:1), targets ≥ 48×48px and ≥ 8px apart (adjacent targets that tile a container, such as list
    rows, segments and connected button groups, need no gap), and a visible focus ring built from the
    focus indicator tokens?

The consolidated checklist lives in `references/audit-checklist.md`.

## Sources

- M3 blog, "Start building with Material 3 Expressive" (May 13, 2025): https://m3.material.io/blog/building-with-m3-expressive
- design.google, "Better, Easier, Emotional UX: The research behind Google's bold new direction for design" (May 13, 2025): https://design.google/library/expressive-material-design-google-research
- Google Keyword launch post (May 13, 2025): https://blog.google/products-and-platforms/platforms/android/material-3-expressive-android-wearos-launch/
- M3 blog, "Adding Motion Physics with Jetpack Compose" (May 20, 2025): https://m3.material.io/blog/m3-expressive-motion-theming
- M3 blog, "What does your UI say to your users?" (M2 vs M3 study, May 13, 2024): https://m3.material.io/blog/testing-material-3
- M3 blog, "What's new at Google I/O 2026" (May 19, 2026): https://m3.material.io/blog/whats-new-at-io26
- M3 blog, "Material Android is Compose-first" (May 19, 2026): https://m3.material.io/blog/material-is-compose-first
- Get started: https://m3.material.io/get-started
- Usability overview: https://m3.material.io/foundations/usability/overview
- Applying M3 Expressive (Usability): https://m3.material.io/foundations/usability/applying-m-3-expressive
- Design tokens overview: https://m3.material.io/foundations/design-tokens/overview
- How to use tokens: https://m3.material.io/foundations/design-tokens/how-to-use-tokens
- Customization: https://m3.material.io/foundations/customization
- Accessibility principles: https://m3.material.io/foundations/overview/principles
- Color contrast: https://m3.material.io/foundations/designing/color-contrast
- Structure: https://m3.material.io/foundations/designing/structure
- Flow: https://m3.material.io/foundations/designing/flow
- Color system: https://m3.material.io/styles/color/system/overview
- Typography overview: https://m3.material.io/styles/typography/overview
- Type scale tokens: https://m3.material.io/styles/typography/type-scale-tokens
- Applying type: https://m3.material.io/styles/typography/applying-type
- Shape overview and principles: https://m3.material.io/styles/shape/overview-principles
- Shape morph: https://m3.material.io/styles/shape/shape-morph
- Motion, how it works: https://m3.material.io/styles/motion/overview/how-it-works
- Motion specs (web spring-to-curve table): https://m3.material.io/styles/motion/overview/specs
- Applying transitions (reduced motion): https://m3.material.io/styles/motion/transitions/applying-transitions
- Layout overview: https://m3.material.io/foundations/layout/layout-overview/overview
- Components (exact component specs): https://m3.material.io/components
- WCAG 2.2, Target Size (Minimum) 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Develop for web: https://m3.material.io/develop/web
- Material Web roadmap: https://github.com/material-components/material-web/blob/main/docs/roadmap.md
- Compose Material3 releases: https://developer.android.com/jetpack/androidx/releases/compose-material3
- Material 3 in Compose: https://developer.android.com/develop/ui/compose/designsystems/material3
- Wear OS design benefits: https://developer.android.com/design/ui/wear/guides/get-started/benefits
- Material Color Utilities: https://github.com/material-foundation/material-color-utilities
- MDN browser-compat-data (`light-dark()`, `AccentColor`): https://github.com/mdn/browser-compat-data
