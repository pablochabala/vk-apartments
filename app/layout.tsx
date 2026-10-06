import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Inter_Tight } from "next/font/google";
import { amenities, apartments, media, site } from "@/content";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const title = "VK Apartments | Furnished Apartments in Nkana East, Kitwe";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | VK Apartments" },
  description: site.description,
  keywords: [
    "apartments in Nkana East Kitwe",
    "Nkana East apartments",
    "Kitwe apartments",
    "furnished apartments Kitwe",
    "short stay Kitwe",
    "apartments with pool Kitwe",
    "VK Apartments",
    "Copperbelt accommodation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZM",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: media.living.src, width: media.living.w, height: media.living.h, alt: media.living.alt }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: [media.living.src] },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#24282b",
  width: "device-width",
  initialScale: 1,
};

const prices = apartments.types.map((t) => t.price);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ApartmentComplex", "LocalBusiness"],
  "@id": `${site.url}/#vk-apartments`,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone.e164,
  image: [media.living, media.pool, media.facade].map((m) => `${site.url}${m.src}`),
  priceRange: `${apartments.currency}${Math.min(...prices)}–${apartments.currency}${Math.max(...prices)} per night`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nkana East",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.map.lat, longitude: site.map.lng },
  hasMap: site.map.shortLink,
  numberOfAccommodationUnits: apartments.types.length,
  amenityFeature: amenities.items.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.title, value: true })),
  sameAs: site.socials.filter((s) => !s.href.includes("wa.me")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZM" className={`${archivo.variable} ${instrument.variable} ${inter.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <style>{`[role="status"][aria-label^="Loading"]{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
