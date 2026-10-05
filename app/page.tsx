import { Loader } from "@/components/chrome/Loader";
import { Header } from "@/components/chrome/Header";
import { Menu } from "@/components/chrome/Menu";
import { FloatingCTA } from "@/components/chrome/FloatingCTA";
import { BookingModal } from "@/components/chrome/BookingModal";
import { Cursor } from "@/components/chrome/Cursor";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Location } from "@/components/sections/Location";
import { Nearby } from "@/components/sections/Nearby";
import { Amenities } from "@/components/sections/Amenities";
import { Interiors } from "@/components/sections/Interiors";
import { Architecture } from "@/components/sections/Architecture";
import { Apartments } from "@/components/sections/Apartments";
import { Gallery } from "@/components/sections/Gallery";
import { HowToBook } from "@/components/sections/HowToBook";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Header />
      <Menu />
      <main id="main">
        <Hero />
        <Manifesto />
        <Location />
        <Nearby />
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
      <BookingModal />
      <Cursor />
    </>
  );
}
