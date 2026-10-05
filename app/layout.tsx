import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { apartments, media, site } from "@/content";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

const title = "VK Apartments | Apartments in Nkana East, Kitwe";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | VK Apartments" },
  description: site.description,
  keywords: ["apartments in Nkana East Kitwe", "Nkana East apartments", "Kitwe apartments", "furnished apartments Kitwe", "short stay Kitwe", "VK Apartments", "Copperbelt accommodation"],
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
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#17302A",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["ApartmentComplex", "LodgingBusiness"],
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone.e164,
  image: [media.living.src, media.pool.src, media.facade.src].map((p) => new URL(p, site.url).toString()),
  priceRange: `K${Math.min(...apartments.types.map((t) => t.price))}–K${Math.max(...apartments.types.map((t) => t.price))} per night`,
  currenciesAccepted: "ZMW",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nkana East",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.map.lat, longitude: site.map.lng },
  hasMap: site.map.shortLink,
  sameAs: site.socials.filter((s) => s.label !== "WhatsApp").map((s) => s.href),
  amenityFeature: ["Swimming pool", "Secure parking", "24/7 security", "Wi-Fi", "DStv", "Air conditioning", "Garden"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  makesOffer: apartments.types.map((t) => ({
    "@type": "Offer",
    name: `${t.label} apartment`,
    price: t.price,
    priceCurrency: "ZMW",
    unitText: "night",
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${instrument.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Skip the intro loader on repeat visits / reduced motion before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('vk-intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only z-[400] rounded-full bg-copper px-5 py-3 text-limestone focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
