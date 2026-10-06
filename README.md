# VK Apartments — website

Marketing site for **VK Apartments, Nkana East, Kitwe, Zambia**: an editorial, scroll-driven one-pager with a
copper/slate/sand palette and an arch motif (doorways, image masks, dividers, loader and logo).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · Embla Carousel · `next/image`

---

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run build`     | Production build                      |
| `npm start`         | Serve the production build            |
| `npm run lint`      | ESLint (Next.js core-web-vitals rules) |
| `npm run typecheck` | TypeScript check                      |

---

## Edit the content

**Almost everything lives in [`content.ts`](./content.ts).** You don't need to touch components to change:

- **Phone, WhatsApp, address, map, socials**: `site`
- **Map pin**: `site.map.lat` / `site.map.lng`. These drive the embedded map and the SEO schema. `site.map.shortLink` is used for every "Get directions" / "Open in Google Maps" button.
- **Navigation labels**: `nav`
- **Hero headline and tagline**: `hero`
- **Section copy**: `manifesto`, `location`, `amenities`, `interiors`, `architecture`, `howToBook`, `contact`. In `manifesto.paragraph`, wrap words in `*asterisks*` to highlight them in copper.
- **Marquee places**: `nearby.rowA` / `nearby.rowB`
- **Apartment types and prices**: `apartments.types`. Set `size` (m²) to show it, or leave it `null` to hide it.
- **Gallery**: `gallery.images`

Search the file for `REPLACE` to find every placeholder or unconfirmed fact. These include:

- bathrooms and maximum guests per unit
- backup power and water details
- accepted payment methods
- your real domain in `site.url`

### Photos

Photos live in `public/media/` and are registered in the `media` object in `content.ts` with their alt text and pixel size.

To swap a photo:

1. Replace the file, keeping the same name, or add a new one.
2. Update `w` / `h` in `media` so the layout keeps the right proportions.

`kitchen.jpg` and `lounge.jpg` are currently crops of `living.jpg` and `dining.jpg`. Replace them with dedicated photos when you have them.

**Walk-through video ("Step inside"):** the living-room clip follows the visitor's cursor on desktop
(left edge = start, right edge = end) and their scroll on phones; a slider under it works for keyboard users.
To replace it, re-encode your clip with a keyframe on every frame so it can be scrubbed smoothly
(the exact `ffmpeg` commands are next to `media.livingPan` in `content.ts`), save it as
`public/media/living-pan.mp4` + `.webm`, and export a still as `living-pan.jpg` for the poster.

**Optional hero video:** add a short, muted, compressed loop at `public/media/hero.mp4`, then set `media.heroVideo` to `"/media/hero.mp4"`. The living-room photo becomes its poster.

### Enquiry form

The form validates name, phone and apartment. It then opens **WhatsApp** with the enquiry pre-filled to `site.phone.whatsapp`, so you don't need a server or email service. On desktop, "Book a call" scrolls to this form. On phones it dials **057 060 9865**.

---

## Project structure

```
app/
  layout.tsx        fonts, SEO metadata, Open Graph, ApartmentComplex/LocalBusiness JSON-LD
  page.tsx          section order
  globals.css       design tokens (colours, fonts), grain, buttons, fields
  icon.svg, robots.ts, sitemap.ts
components/
  providers/SiteProvider.tsx   Lenis smooth scroll (synced to GSAP), intro/menu state, scrollTo
  layout/   Loader, Header, MenuOverlay, FloatingCTA, Cursor, Footer, BookCallButton
  sections/ Hero, Manifesto, Location, NearbyMarquee, Amenities, Interiors,
            Walkthrough, Architecture, Apartments, Gallery, HowToBook, Contact
  ui/       RevealText, SectionTitle, ParallaxImage, Marquee, MagneticButton,
            MapEmbed, ScrubVideo, Arch (logo + motif), Icon
lib/
  gsap.ts       plugin registration + reduced-motion / pointer helpers
  whatsapp.ts   WhatsApp + map embed URL helpers
content.ts      ← all editable content
public/media/   photos
```

### Design tokens

These are in `app/globals.css` under `@theme`:

| Token       | Hex                    | Use                                  |
| ----------- | ---------------------- | ------------------------------------ |
| `limestone` | `#F4EFE6`              | page background                      |
| `ink`       | `#1E1B17`              | text                                 |
| `copper`    | `#B4643C` / `#9A5230`  | accents (deep shade for small text)  |
| `slate`     | `#24282B`              | dark sections, taken from the facade |
| `sand`      | `#E3CFAE`              | soft accents on dark                 |

Fonts:

- **Archivo:** condensed uppercase headlines
- **Instrument Serif Italic:** emotional accent lines
- **Inter Tight:** body text

### Motion and accessibility

- **Pinned sections:** the amenities strip and the gallery pin and scroll horizontally on desktop only (≥1024px). On smaller screens they become swipe rows.
- **Reduced motion:** `prefers-reduced-motion` turns off smooth scroll, pinning, parallax, the loader animation and the custom cursor. Content then fades in.
- **Touch devices:** the custom cursor and the magnetic buttons only run on fine pointers, so phones and tablets don't get them.
- **Menu:** keyboard-accessible. Esc closes it, Tab is trapped inside, and focus returns to the Menu button.
- **Performance:** animations use transforms, opacity and clip-path. The map iframe only loads when it approaches the viewport. GSAP contexts are cleaned up on unmount via `useGSAP`.

---

## Deploy to Vercel

1. Push this repository to GitHub.
2. In [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects Next.js, so keep the default build settings.
3. Click **Deploy**.
4. Once you have your domain, set `site.url` in `content.ts` to it so canonical URLs, Open Graph images and the sitemap are correct. Then add the domain under **Project → Settings → Domains**.

Every push to the main branch redeploys automatically. Pull requests get their own preview URLs.

Optional: after going live, submit the sitemap (`https://your-domain/sitemap.xml`) in [Google Search Console](https://search.google.com/search-console), and create or claim a **Google Business Profile** for VK Apartments.
