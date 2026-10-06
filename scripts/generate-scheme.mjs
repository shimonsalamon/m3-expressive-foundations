#!/usr/bin/env node
// Generate a Material 3 color scheme from a seed (brand) color and print it as CSS
// custom properties in the same shape as assets/m3-expressive-tokens.css:
// light-dark() roles for standard / medium / high contrast, the data-contrast and
// prefers-contrast hooks, and a plain light/dark fallback for older browsers.
//
// Requires @material/material-color-utilities in the current project (or next to
// this script):   npm install --save-dev @material/material-color-utilities
//
// Usage:
//   node generate-scheme.mjs --seed "#0B6E4F"
//   node generate-scheme.mjs --seed "#0B6E4F" --variant vibrant --custom success=#1B873B,warning=#B26A00
//   node generate-scheme.mjs --seed "#0B6E4F" --selector ".brand-a" --out brand-a.css
//
// Options:
//   --seed <hex>          source color (required)
//   --variant <name>      tonal-spot (default) | neutral | vibrant | expressive | fidelity |
//                         content | monochrome | rainbow | fruit-salad
//   --spec 2021|2025      Material Color Utilities color spec (default 2021, which matches the
//                         documented M3 token tables; 2025 is undocumented on m3.material.io)
//   --selector <css>      scope for the output (default :root); use a class to theme a subtree
//   --custom a=#hex,...   extra brand colors; harmonized toward the seed unless written a=#hex!
//   --custom-prefix <p>   prefix for custom colors, e.g. brand or --custom-prefix=--brand
//                         (default app-color): gives --<p>-<name>, --<p>-on-<name>,
//                         --<p>-<name>-container, --<p>-on-<name>-container
//   --palettes            also print the six tonal palettes as --md-ref-palette-* tokens
//   --out <file>          write to a file instead of stdout
import { register, createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// ---- arguments
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const eq = a.indexOf('=');
  if (eq > 0) { args[a.slice(2, eq)] = a.slice(eq + 1); continue; } // --key=value (needed when the value starts with --)
  const key = a.slice(2);
  const next = process.argv[i + 1];
  if (next === undefined || next.startsWith('--')) args[key] = true; else { args[key] = next; i++; }
}
const die = msg => { console.error(`generate-scheme: ${msg}`); process.exit(1); };
if (!args.seed || !/^#?[0-9a-f]{6}$/i.test(String(args.seed))) die('pass --seed "#RRGGBB"');
const seedHex = '#' + String(args.seed).replace('#', '').toUpperCase();
const selector = args.selector && args.selector !== true ? args.selector : ':root';
const spec = String(args.spec ?? '2021');
if (!['2021', '2025'].includes(spec)) die('--spec must be 2021 or 2025');

// ---- load Material Color Utilities (0.4.0 ships extensionless ESM imports that plain
// Node rejects, so add ".js" when a relative import inside the package fails to resolve)
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (e) {
    if (/^\\.{1,2}\\//.test(specifier) && !/\\.[cm]?js$/.test(specifier) && context.parentURL && context.parentURL.includes('material-color-utilities')) {
      return next(specifier + '.js', context);
    }
    throw e;
  }
}`));
let mcu;
for (const base of [path.join(process.cwd(), 'noop.js'), fileURLToPath(import.meta.url)]) {
  try { mcu = await import(pathToFileURL(createRequire(base).resolve('@material/material-color-utilities')).href); break; } catch { /* try next */ }
}
if (!mcu) die('cannot find @material/material-color-utilities. Install it in this project: npm install --save-dev @material/material-color-utilities');
const { Hct, argbFromHex, hexFromArgb, MaterialDynamicColors, TonalPalette, Blend } = mcu;

const VARIANTS = {
  'tonal-spot': 'SchemeTonalSpot', neutral: 'SchemeNeutral', vibrant: 'SchemeVibrant', expressive: 'SchemeExpressive',
  fidelity: 'SchemeFidelity', content: 'SchemeContent', monochrome: 'SchemeMonochrome', rainbow: 'SchemeRainbow', 'fruit-salad': 'SchemeFruitSalad',
};
const variant = String(args.variant ?? 'tonal-spot');
const SchemeClass = mcu[VARIANTS[variant]] ?? die(`unknown --variant ${variant}; use one of ${Object.keys(VARIANTS).join(', ')}`);

// ---- roles, in the token file's order (camelCase = MaterialDynamicColors property)
const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  'surface', 'surfaceDim', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'onSurface', 'surfaceVariant', 'onSurfaceVariant', 'inverseSurface', 'inverseOnSurface',
  'background', 'onBackground', 'outline', 'outlineVariant', 'shadow', 'scrim',
];
const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
const hex = argb => hexFromArgb(argb).toUpperCase();
const source = Hct.fromInt(argbFromHex(seedHex));
const CONTRAST = { standard: 0, medium: 0.5, high: 1 };
const schemes = {};
for (const [name, level] of Object.entries(CONTRAST)) for (const dark of [false, true]) {
  schemes[`${name}/${dark ? 'dark' : 'light'}`] = new SchemeClass(source, dark, level, spec);
}
const roleValue = (role, contrast, theme) => hex(MaterialDynamicColors[role].getArgb(schemes[`${contrast}/${theme}`]));

// ---- custom colors: four roles each, from a tonal palette (harmonized toward the seed by
// default). Tones copy the baseline primary family at each contrast level (Material publishes
// no tone table for custom colors at medium/high): [color, on-color, container, on-container].
const RECIPE = {
  standard: { light: [40, 100, 90, 30], dark: [80, 20, 30, 90] },
  medium: { light: [30, 100, 40, 100], dark: [90, 10, 60, 0] },
  high: { light: [20, 100, 30, 100], dark: [95, 0, 80, 0] },
};
const rawPrefix = args['custom-prefix'] && args['custom-prefix'] !== true ? String(args['custom-prefix']) : 'app-color';
const prefix = rawPrefix.startsWith('--') ? rawPrefix : `--${rawPrefix}`;
if (!/^--[a-z][a-z0-9-]*$/i.test(prefix)) die('--custom-prefix must be a name like app-color');
if (prefix.startsWith('--md-') || prefix.startsWith('--m3e-')) die('--custom-prefix must not use the --md- or --m3e- namespaces; pick a product prefix');
const customs = [];
if (args.custom && args.custom !== true) {
  for (const part of String(args.custom).split(',')) {
    const m = part.trim().match(/^([a-z][a-z0-9-]*)=(#?[0-9a-f]{6})(!?)$/i) ?? die(`bad --custom entry "${part}" (use name=#RRGGBB or name=#RRGGBB!)`);
    const value = argbFromHex('#' + m[2].replace('#', ''));
    const argb = m[3] ? value : Blend.harmonize(value, source.toInt());
    customs.push({ name: m[1].toLowerCase(), palette: TonalPalette.fromInt(argb), harmonized: !m[3] });
  }
}
const customLines = (indent, mode, contrast = 'standard') => customs.flatMap(({ name, palette }) => {
  const { light, dark } = RECIPE[contrast];
  const names = [`${prefix}-${name}`, `${prefix}-on-${name}`, `${prefix}-${name}-container`, `${prefix}-on-${name}-container`];
  return names.map((n, i) => {
    const l = hex(palette.tone(light[i])), d = hex(palette.tone(dark[i]));
    return `${indent}${n}: ${mode === 'light' ? l : mode === 'dark' ? d : `light-dark(${l}, ${d})`};`;
  });
});

// ---- output
const L = [];
const colorBlock = (indent, contrast, mode) => {
  for (const role of ROLES) {
    const l = roleValue(role, contrast, 'light'), d = roleValue(role, contrast, 'dark');
    L.push(`${indent}--md-sys-color-${kebab(role)}: ${mode === 'light' ? l : mode === 'dark' ? d : (l === d ? l : `light-dark(${l}, ${d})`)};`);
  }
  L.push(`${indent}--md-sys-color-surface-tint: var(--md-sys-color-primary);`);
  L.push(`${indent}--m3e-focus-indicator-color: var(--md-sys-color-secondary);`);
};
// Selectors. At :root, an attribute can sit on <html> or on any subtree. For a scoped scheme
// (--selector .brand) the attribute can sit on an ancestor (e.g. <html>), on the scope element,
// or on an element inside it. The OS-preference rules use :where() so an explicit attribute
// always outranks them. If ancestors at different levels disagree, the later contrast level
// wins, so set data-contrast either on <html> or on the scope element, not both.
const isRoot = selector === ':root';
const osRule = cond => isRoot ? `:root:not(${cond})` : `:where(:root:not(${cond})) ${selector}`;
const attrRule = attr => isRoot ? `[${attr}]` : `[${attr}] ${selector}, ${selector}[${attr}], ${selector} [${attr}]`;

L.push('/*');
L.push(` * Material 3 color scheme generated from seed ${seedHex}`);
L.push(` * variant: ${variant}; Material Color Utilities color spec ${spec}; contrast levels 0 / 0.5 / 1.0.`);
L.push(' * Generated by scripts/generate-scheme.mjs (m3-expressive-foundations skill). Load it after');
L.push(' * assets/m3-expressive-tokens.css. Unlike the static baseline there, generated schemes also');
L.push(' * shift surface roles with contrast, so every contrast block restates every role.');
if (customs.length) {
  L.push(` * Custom colors (${prefix}-*): ${customs.map(c => `${c.name}${c.harmonized ? ' (harmonized)' : ''}`).join(', ')}.`);
  L.push(' * Their medium/high tones copy the baseline primary family (Material publishes none for');
  L.push(' * custom colors), so verify their contrast in your UI.');
}
L.push(' */');
L.push('@supports (color: light-dark(#000, #fff)) {');
L.push(`  ${selector} {`);
colorBlock('    ', 'standard', 'light-dark');
L.push(...customLines('    ', 'light-dark'));
L.push('  }');
L.push('  @media (prefers-contrast: more) {');
L.push(`    ${osRule('[data-contrast]')} {`);
colorBlock('      ', 'high', 'light-dark');
L.push(...customLines('      ', 'light-dark', 'high'));
L.push('    }');
L.push('  }');
for (const c of Object.keys(CONTRAST)) {
  L.push(`  ${attrRule(`data-contrast="${c}"`)} {`);
  colorBlock('    ', c, 'light-dark');
  L.push(...customLines('    ', 'light-dark', c));
  L.push('  }');
}
L.push('}');
L.push('@supports not (color: light-dark(#000, #fff)) {');
L.push(`  ${selector} {`);
colorBlock('    ', 'standard', 'light');
L.push(...customLines('    ', 'light'));
L.push('  }');
L.push('  @media (prefers-color-scheme: dark) {');
L.push(`    ${osRule('[data-theme="light"]')} {`);
colorBlock('      ', 'standard', 'dark');
L.push(...customLines('      ', 'dark'));
L.push('    }');
L.push('  }');
for (const [theme, mode] of [['dark', 'dark'], ['light', 'light']]) {
  L.push(`  ${attrRule(`data-theme="${theme}"`)} {`);
  colorBlock('    ', 'standard', mode);
  L.push(...customLines('    ', mode));
  L.push('  }');
}
L.push('}');

if (args.palettes) {
  const s = schemes['standard/light'];
  const pals = { primary: s.primaryPalette, secondary: s.secondaryPalette, tertiary: s.tertiaryPalette, neutral: s.neutralPalette, 'neutral-variant': s.neutralVariantPalette, error: s.errorPalette };
  L.push(`${selector} {`);
  for (const [name, p] of Object.entries(pals)) {
    const tones = name === 'neutral' ? [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
    for (const t of tones) L.push(`  --md-ref-palette-${name}${t}: ${hex(p.tone(t))};`);
  }
  L.push('}');
}

const css = L.join('\n') + '\n';
if (args.out && args.out !== true) { fs.writeFileSync(args.out, css); console.error(`generate-scheme: wrote ${args.out}`); } else process.stdout.write(css);
