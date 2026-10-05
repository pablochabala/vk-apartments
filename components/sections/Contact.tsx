"use client";

import { contact, site } from "@/content";
import { Heading } from "@/components/ui/Heading";
import { EnquiryForm } from "@/components/ui/EnquiryForm";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { VeinLines } from "@/components/ui/VeinLines";

export function Contact() {
  return (
    <section id="contact" className="hex-lattice relative overflow-hidden bg-malachite py-24 text-limestone md:py-40">
      <VeinLines className="pointer-events-none absolute left-0 top-10 h-40 w-full opacity-50" color="var(--color-copper-lt)" />
      <div className="gutter relative mx-auto max-w-[1440px]">
        <Heading serif={contact.titleSerif} title={contact.title} size="xl" serifClassName="text-blush" />

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="eyebrow mb-10 text-copper-lt">{contact.formTitle}</h3>
            <EnquiryForm tone="dark" />
          </div>

          <div className="space-y-12 lg:col-span-5 lg:col-start-8">
            <div>
              <p className="eyebrow mb-3 text-sand/80">Call or WhatsApp</p>
              <a href={site.phone.tel} className="display block text-[clamp(2.5rem,6vw,4.5rem)] tabular-nums transition-colors hover:text-copper-lt" data-cursor="link">
                {site.phone.display}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3 text-sand/80">Address</p>
              <address className="text-xl not-italic">{site.address.full}</address>
            </div>
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
