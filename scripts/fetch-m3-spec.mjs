#!/usr/bin/env node
// Reads a page of m3.material.io -- its text, and its component tokens -- for the component specs this skill leaves
// out (sizes, shapes, colors and motion per component).
//
// m3.material.io is a JavaScript shell: fetched as HTML it holds no content. The site loads each page from its own
// content API, which this script calls the same way:
//   1. The bundle (/static/angular/main.<hash>.js) names the current content build ("carbonVersion") and maps every
//      route ("slug") to its page file ("exportedCarbonFileId").
//   2. The page is /_dsm/content/m3/<build>/<file>: its blocks of text, images with alt text, and token tables.
//   3. A token table is /_dsm/data/dsdb-m3/<build>/TOKEN_TABLE.<component id>.json, the id from the page's
//      "designSystems/<system>/components/<component id>" resources.
// None of this is a documented API; if the site changes, these three steps are what to look for again.
//
// Usage:
//   node scripts/fetch-m3-spec.mjs --list [filter]           routes, optionally only those containing the filter
//   node scripts/fetch-m3-spec.mjs components/menus          the page's text (all its tabs)
//   node scripts/fetch-m3-spec.mjs components/menus --tokens  ... and its component tokens with default values
//   node scripts/fetch-m3-spec.mjs components/menus --tokens --all-contexts   ... with every context's value
//
// Needs Node 18+ (global fetch). Prints to stdout; redirect to keep a copy.

const SITE = 'https://m3.material.io';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const positional = args.filter((arg) => !arg.startsWith('--'));

const get = async (path, as = 'json') => {
  const response = await fetch(path.startsWith('http') ? path : `${SITE}${path}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${path}`);
  return as === 'json' ? response.json() : response.text();
};

// The bundle: the content build and the route table.
const loadSite = async () => {
  const shell = await get('/', 'text');
  const mainPath = shell.match(/src="(\/static\/angular\/main\.[^"]+\.js)"/)?.[1];
  if (!mainPath) throw new Error('No main bundle in the page shell: the site layout changed.');
  const bundle = await get(mainPath, 'text');
  const build = bundle.match(/carbonVersion:"([^"]+)"/)?.[1];
  if (!build) throw new Error('No carbonVersion in the bundle: the site layout changed.');
  const routes = [...bundle.matchAll(/\{"slug":"([^"]+)","exportedCarbonFileId":"([^"]+)"/g)].map(([, slug, file]) => ({
    slug,
    file,
  }));
  return { build, routes };
};

// A page's readable text, in order: prose as paragraphs, images as [img: alt], captions as [caption: ...].
const pageText = (page) => {
  const lines = [];
  const clean = (text) =>
    text
      // A block's end is a word break ("...instead</p><p>Menus" is two sentences); inline tags are not.
      .replace(/<\/(p|li|h\d|div|ul|ol|tr|td)>|<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;|&rsquo;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  const walk = (node, key = '') => {
    if (typeof node === 'string') {
      const text = clean(node);
      if (!text || /^https?:\/\//.test(text) || /^[\w-]+\/[\w/-]+$/.test(text) || !/\s/.test(text)) return;
      if (/alt/i.test(key)) lines.push(`[img: ${text}]`);
      else if (/caption/i.test(key)) lines.push(`[caption: ${text}]`);
      else if (!/(id|name|url|uri|type|style|theme|icon|color|variant|layout|alignment)$/i.test(key)) lines.push(text);
      return;
    }
    if (Array.isArray(node)) node.forEach((item) => walk(item, key));
    else if (node && typeof node === 'object') Object.entries(node).forEach(([k, v]) => walk(v, k));
  };
  walk(page.sections ?? page);
  return lines.filter((line, i) => line !== lines[i - 1]).join('\n');
};

// A value as text: a reference to another token, or the literal (a length, shape, color, opacity...).
const valueText = (value) => {
  if (value.tokenName) return `-> ${value.tokenName}`;
  const skip = new Set(['name', 'revisionId', 'revisionCreateTime', 'state', 'createTime', 'contextTags', 'specificityScore']);
  const literal = Object.fromEntries(Object.entries(value).filter(([k]) => !skip.has(k)));
  return JSON.stringify(literal);
};

const tokenTable = async (build, componentId, allContexts) => {
  let data;
  try {
    data = await get(`/_dsm/data/dsdb-m3/${build}/TOKEN_TABLE.${componentId}.json`);
  } catch {
    data = await get(`/_dsm/data/dsdb-m3/${build}/TOKEN_TABLE.${componentId}`);
  }
  const system = data.system ?? data;
  const tagNames = new Map((system.tags ?? []).map((tag) => [tag.name, tag.tagName ?? tag.displayName]));
  const groupNames = new Map((system.contextTagGroups ?? []).map((g) => [g.name, g.contextTagGroupName]));
  const contextOf = (value) =>
    (value.contextTags ?? [])
      .map((tag) => `${groupNames.get(tag.split('/tags/')[0]) ?? '?'}=${tagNames.get(tag) ?? '?'}`)
      .join(', ');

  const valuesByToken = new Map();
  for (const value of system.values ?? []) {
    const token = value.name.split('/values/')[0];
    if (!valuesByToken.has(token)) valuesByToken.set(token, []);
    valuesByToken.get(token).push(value);
  }

  const component = (system.components ?? [])[0];
  const lines = [`# ${component?.displayName ?? componentId} tokens`];
  const sets = (system.tokenSets ?? []).map((set) => `${set.tokenSetName} (${set.displayName})`);
  if (sets.length) lines.push(`Token sets: ${sets.join('; ')}`);

  const tokens = (system.tokens ?? []).filter((token) => token.tokenName?.startsWith('md.comp.'));
  if (!tokens.length) return null; // a resource from another design system, with no component tokens of its own
  tokens.sort((a, b) => a.tokenName.localeCompare(b.tokenName));
  for (const token of tokens) {
    const values = valuesByToken.get(token.name) ?? [];
    const plain = values.filter((value) => !value.contextTags?.length);
    const shown = allContexts ? values : plain.length ? plain : values.slice(0, 1);
    for (const value of shown) {
      const context = contextOf(value);
      lines.push(`${token.tokenName} ${valueText(value)}${context ? `  [${context}]` : ''}`);
    }
  }
  return lines.join('\n');
};

const main = async () => {
  const { build, routes } = await loadSite();

  if (flag('--list')) {
    const filter = positional[0] ?? '';
    console.log(`content build ${build}`);
    routes.filter((route) => route.slug.includes(filter)).forEach((route) => console.log(route.slug));
    return;
  }

  const slug = positional[0]?.replace(/^\/+|\/+$/g, '');
  if (!slug) {
    console.error('Name a page, e.g. components/menus (or --list to see them).');
    process.exit(1);
  }
  const route = routes.find((r) => r.slug === slug);
  if (!route) {
    const near = routes.filter((r) => r.slug.includes(slug.split('/').pop())).map((r) => r.slug);
    console.error(`No page "${slug}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''}`);
    process.exit(1);
  }

  const page = await get(`/_dsm/content/m3/${build}/${route.file}`);
  console.log(`# ${page.headerTitle || page.title} (m3.material.io/${slug}, content build ${build})\n`);
  console.log(pageText(page));

  if (flag('--tokens')) {
    const ids = [...new Set([...JSON.stringify(page).matchAll(/designSystems\/[0-9a-f]+\/components\/([0-9a-f]+)/g)].map((m) => m[1]))];
    if (!ids.length) console.log('\n(No token tables on this page.)');
    for (const id of ids) {
      try {
        const table = await tokenTable(build, id, flag('--all-contexts'));
        if (table) console.log(`\n${table}`);
      } catch (error) {
        console.log(`\n(Token table ${id} could not be read: ${error.message})`);
      }
    }
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
