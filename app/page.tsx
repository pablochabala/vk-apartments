import { SiteProvider } from "@/components/providers/SiteProvider";
import { Loader } from "@/components/layout/Loader";
import { Header } from "@/components/layout/Header";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Location } from "@/components/sections/Location";
import { NearbyMarquee } from "@/components/sections/NearbyMarquee";
import { Amenities } from "@/components/sections/Amenities";
import { Interiors } from "@/components/sections/Interiors";
import { Architecture } from "@/components/sections/Architecture";
import { Apartments } from "@/components/sections/Apartments";
import { Gallery } from "@/components/sections/Gallery";
import { HowToBook } from "@/components/sections/HowToBook";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SiteProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
        Skip to content
      </a>
      <Loader />
      <Header />
      <MenuOverlay />
      <main id="main">
        <Hero />
        <Manifesto />
        <Location />
        <NearbyMarquee />
        <Amenities />
        <Interiors />
        <Architecture />
        <Apartments />
        <Gallery />
        <HowToBook />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </SiteProvider>
  );
}
