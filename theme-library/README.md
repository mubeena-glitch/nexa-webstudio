# NEXA Web Studio — Design Theme Library (v1.0.0)

A consolidated, integration-ready package of **15 distinct, token-driven website design themes**.
Each theme is a self-contained design system: a `theme.json` design-token manifest plus a fully
designed, animated `preview.html` reference page using real imagery.

## How to view (for review)
1. Open **`gallery.html`** in a browser — thumbnails of all 15 themes; click any to open its full preview.
2. Or open any file in **`previews/<id>.html`** directly.

> Previews load fonts (Google Fonts / Fontshare), photos (Unsplash) and the animation library
> (GSAP) from public CDNs, so an internet connection is needed. For the smoothest experience
> (correct scroll animations), serve the folder over HTTP, e.g. from this directory run:
> `python3 -m http.server 8080` then visit `http://localhost:8080/gallery.html`.

## Contents
```
consolidated/
├── gallery.html                     # visual index of all themes (static thumbnails)
├── catalog.json                     # machine-readable catalog (id, sector, palette, fonts, paths)
├── INTEGRATION.md                   # how to wire themes into the Web Studio token engine
├── schema/
│   └── style-manifest.schema.json   # JSON Schema every theme.json validates against
├── themes/                          # the 15 design-token manifests (integration artifacts)
│   ├── meridian.json … spark.json
├── previews/                        # 15 full self-contained reference pages
│   ├── meridian.html … spark.html
└── thumbnails/                      # hero screenshot of each theme (used by gallery)
```

## The 15 themes
| id | sector | mode | family |
|----|--------|------|--------|
| `meridian` | Fintech / private banking | dark | modern |
| `halcyon` | Wellness / spa | light | minimal |
| `atlas` | SaaS / B2B | light | modern |
| `noir` | Luxury fashion | dark | luxury |
| `voltage` | Creative agency | dark | bold |
| `ember` | Restaurant / hospitality | light | luxury |
| `cobalt` | Healthcare / medical | light | corporate |
| `quanta` | Crypto / Web3 | dark | vibrant |
| `verdant` | Sustainability / nonprofit | light | minimal |
| `chalk` | Education / EdTech | light | vibrant |
| `bastion` | Legal / professional | light | corporate |
| `horizon` | Travel / tourism | light | vibrant |
| `pulse` | Fitness / sports | dark | bold |
| `terrace` | Real estate / architecture | light | minimal |
| `spark` | E-commerce / retail | light | vibrant |

## What "token-driven" means
A theme defines only the **skin** — colors, typography, spacing, radii, shadows, motion, imagery
treatment — as data (`theme.json`). It contains no page structure or content. The same theme can be
applied to any sitemap/brief. See **INTEGRATION.md** for how the studio consumes these tokens.
