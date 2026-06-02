# Integrating a theme into NEXA Web Studio

Each `themes/<id>.json` is a **StyleManifest** validated against `schema/style-manifest.schema.json`.
Its `tokens` map 1:1 to CSS custom properties. The studio renders any page as:

```
Final render = Content (from briefs) × Layout (section variants) × Theme (these tokens)
```

## 1. Token → CSS variable mapping
Colours are stored as **space-separated RGB channel triples** (e.g. `"16 33 46"`) so Tailwind
alpha modifiers work: `rgb(var(--color-ink) / 0.6)`.

```ts
// tokensToCSSVars(theme.tokens) -> { '--color-bg': '13 15 14', '--font-display': '"Clash Display",…', … }
function tokensToCSSVars(tk) {
  const v = {};
  for (const [k, val] of Object.entries(tk.color))  v[`--color-${kebab(k)}`] = val;
  v['--font-display'] = tk.type.display;
  v['--font-body']    = tk.type.body;
  if (tk.type.mono)   v['--font-mono'] = tk.type.mono;
  v['--radius-card']  = tk.radius.card;
  v['--radius-button']= tk.radius.button;
  v['--shadow-card']  = tk.shadow.card;
  v['--ease']         = tk.motion.ease;
  // …spacing, etc.
  return v;
}
```

## 2. Inject at the root (React example)
```tsx
export function StyleProvider({ theme, children }) {
  return <div style={tokensToCSSVars(theme.tokens)}>{children}</div>;
}
```
Swap the `theme` prop → the whole subtree re-skins. This is exactly how the previews work:
each preview's `:root` block is the inlined output of `tokensToCSSVars(theme.tokens)`.

## 3. Tailwind (point theme at the variables, not fixed values)
```js
// tailwind.config.js
theme: { extend: { colors: {
  bg:      'rgb(var(--color-bg) / <alpha-value>)',
  ink:     'rgb(var(--color-ink) / <alpha-value>)',
  primary: 'rgb(var(--color-primary) / <alpha-value>)',
  accent:  'rgb(var(--color-accent) / <alpha-value>)',
}, fontFamily: { display: 'var(--font-display)', body: 'var(--font-body)' } } }
```
Components are written once with `bg-primary text-ink font-display` etc.; only the variables change.

## 4. Contract / validation
Validate any new or AI-generated theme before use:
```bash
npx ajv-cli validate -s schema/style-manifest.schema.json -d "themes/*.json"
```
Required token groups: `color, type, space, radius, shadow, motion, imagery` + `recipes`.
Every section component must consume tokens only — no hard-coded hex/font.

## Notes on the preview files
- Each `previews/<id>.html` is a standalone reference (nav → hero → … → footer) showing the theme
  applied to a realistic page for its sector. Use them as the visual source of truth.
- Motion uses **GSAP + ScrollTrigger** (CDN), gated behind `prefers-reduced-motion` and a no-GSAP
  fallback (content is never hidden if scripts fail). A small visibility failsafe guarantees no
  reveal element can remain hidden.
- Images are Unsplash placeholders — in production these become content slots filled per project.
