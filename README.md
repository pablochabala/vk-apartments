# VK Apartments: website

Marketing site for **VK Apartments, Nkana East, Kitwe, Zambia**. It's a scroll-driven, editorial site built with:

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**
- **GSAP + ScrollTrigger + SplitText** for the animations
- **Lenis** smooth scrolling, kept in sync with ScrollTrigger
- **Embla** carousel (mobile gallery)
- **next/image**, which serves images as AVIF/WebP automatically

The design system is "Copper & Malachite". The colours, fonts and the hex/vein motif are documented in [`design/proposal.html`](design/proposal.html).

---

## 1. Run it locally

You need **Node.js 20+** (from <https://nodejs.org>).

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To create and test a production build:

```bash
npm run build
npm start
```

> **Tip (Windows/OneDrive):** this folder is inside OneDrive, and OneDrive tries to sync the thousands of files in `node_modules`, which makes installs and builds very slow. Either pause OneDrive while you work, or move the project to a folder outside OneDrive (e.g. `C:\dev\vk-apartments`).

---

## 2. Edit the content

**Almost everything lives in one file: [`content.ts`](content.ts).**

| What | Where in `content.ts` |
| --- | --- |
| Phone number, WhatsApp, address | `site.phone`, `site.address` |
| Google Maps link + exact pin | `site.map` (`lat`/`lng` were resolved from the share link) |
| TikTok / Instagram links | `site.socials` |
| Kitwe West branch note | `site.branch` |
| Hero headline + tagline | `hero` |
| "Day at VK" paragraph | `manifesto.paragraph` (wrap words in `*stars*` to highlight them in copper) |
| Nearby places marquee | `nearby.rowA`, `nearby.rowB` |
| Amenities | `amenities.items` (icon names: pool, parking, shield, bolt, drop, leaf, wifi, tv, snow) |
| Apartment types + **prices per night** | `apartments.types` |
| Booking steps + payment info | `howToBook` |
| Gallery photos | `gallery.images` |

Anything marked `// REPLACE` is a placeholder or an unconfirmed fact. Check those before launch:

- `site.url`: your real domain (used for SEO and social previews)
- Bathrooms / max guests / size (m²) per apartment type (set `size` to a number to show it)
- Backup power and water details, payment methods, and location travel-time chips
- Nearby place names for the marquee

### Photos

Real photos are in `public/media/`. To add or replace one:

1. Drop the file in `public/media/` (JPG/PNG, at least 1600px wide is ideal).
2. Add an entry to `media` in `content.ts` with `src`, a descriptive `alt`, and the image's `w`/`h`.
3. Use it anywhere, e.g. in `gallery.images`.

Next.js converts images to AVIF/WebP and serves the right size per device automatically.

The hero plays `public/media/hero.mp4` (muted, looping) over a still image. To change it, replace that file. Keep it short (under about 10 seconds) and small (under 3 MB).

### Floor plans

The apartment tabs show an illustrative plan drawn by `components/ui/FloorPlan.tsx`. To use real plans, add images to `public/media/` and render an `<Image>` in `components/sections/Apartments.tsx` instead.

### Enquiries

There's no backend and no online payment. The enquiry form opens **WhatsApp** with a pre-filled message to 057 060 9865. "Book a call" dials the number on phones and opens the enquiry form on desktop.

---

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "VK Apartments website"
   ```
   Then create a repo on GitHub and follow its "push an existing repository" instructions.
2. Go to <https://vercel.com/new>, import the repository, and keep the defaults (framework: Next.js). Click **Deploy**.
3. Add your domain under **Project → Settings → Domains**, then update `site.url` in `content.ts` and push again.

Every push to `main` redeploys automatically.

---

## 4. Project structure

```
app/
  layout.tsx       fonts, SEO metadata, Open Graph, JSON-LD (ApartmentComplex + LodgingBusiness)
  page.tsx         section order
  globals.css      design tokens (colours, type utilities, chamfer motif, grain)
content.ts         ← all editable content
components/
  providers/       Lenis smooth scroll + UI state (menu, booking, selected unit)
  chrome/          Loader, Header, Menu, FloatingCTA, BookingModal, Cursor
  sections/        Hero, Manifesto, Location, Nearby, Amenities, Interiors,
                   Architecture, Apartments, Gallery, HowToBook, Contact, Footer
  ui/              Heading, RevealText, ParallaxImage, Marquee, MagneticButton,
                   MapEmbed, VeinLines, HexMark, Logo, Icon, FloorPlan, EnquiryForm
lib/gsap.ts        GSAP plugin registration + motion helpers
public/media/      real VK photos + hero video
design/            design proposal
```

## 5. Accessibility & motion

- Visitors who set **reduce motion** on their device get no smooth scroll, pinning, parallax or loader. Content fades in simply instead.
- The custom cursor and magnetic buttons only run on mouse/trackpad devices.
- The menu, booking panel and photo viewer can be used with the keyboard (Esc closes, focus is trapped and restored).
- The form has visible labels, validates when you leave a field, shows its errors next to the field, and moves focus to the first problem.
