"use client";

import { useId, useState } from "react";
import { apartments, contact, site } from "@/content";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/whatsapp";

type Fields = { name: string; phone: string; unit: string; dates: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", phone: "", unit: "", dates: "", message: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  const digits = f.phone.replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 13) e.phone = "Please enter a valid phone number, e.g. 097 123 4567.";
  if (!f.unit) e.unit = "Please choose an apartment.";
  if (f.message.length > 800) e.message = "Please keep your message under 800 characters.";
  return e;
}

export function Contact() {
  const { enquiryUnit } = useSite();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const uid = useId();

  // "Enquire" buttons in the Apartments section pre-select the unit (state adjusted during render).
  const [seenUnit, setSeenUnit] = useState(enquiryUnit);
  if (enquiryUnit !== seenUnit) {
    setSeenUnit(enquiryUnit);
    if (enquiryUnit) setFields((f) => ({ ...f, unit: enquiryUnit }));
  }

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    const firstBad = (Object.keys(errs) as (keyof Fields)[])[0];
    if (firstBad) {
      document.getElementById(`enquiry-${firstBad}`)?.focus();
      return;
    }
    const unitLabel = apartments.types.find((t) => t.id === fields.unit)?.label ?? "Not sure yet";
    const text = [
      `Hello ${site.name}, I'd like to make an enquiry.`,
      `Name: ${fields.name.trim()}`,
      `Phone: ${fields.phone.trim()}`,
      `Apartment: ${unitLabel}`,
      fields.dates.trim() && `Dates: ${fields.dates.trim()}`,
      fields.message.trim() && `Message: ${fields.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-2 text-sm text-[#f0a58f]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Fields) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-slate-soft py-[var(--section-y)] text-paper">
      <div className="container-x">
        <SectionTitle id="contact-title" tone="dark" serif={contact.titleSerif} title={contact.title} size="xl" align="center" className="mb-16 md:mb-28" />

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Form */}
          <div className="lg:col-span-6">
            <h3 className="display text-4xl">{contact.formTitle}</h3>
            <p className="mt-2 text-paper/65">{contact.formNote}</p>

            <form noValidate onSubmit={submit} className="mt-10 grid gap-8 sm:grid-cols-2" aria-describedby={`${uid}-note`}>
              <div>
                <label htmlFor="enquiry-name" className="eyebrow text-sand/70">
                  Name
                </label>
                <input id="enquiry-name" name="name" autoComplete="name" className="field" value={fields.name} onChange={set("name")} required {...aria("name")} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="enquiry-phone" className="eyebrow text-sand/70">
                  Phone
                </label>
                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className="field"
                  value={fields.phone}
                  onChange={set("phone")}
                  required
                  {...aria("phone")}
                />
                {err("phone")}
              </div>
              <div>
                <label htmlFor="enquiry-unit" className="eyebrow text-sand/70">
                  Preferred apartment
                </label>
                <select id="enquiry-unit" name="unit" className="field appearance-none" value={fields.unit} onChange={set("unit")} required {...aria("unit")}>
                  <option value="" disabled>
                    Choose…
                  </option>
                  {apartments.types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} — from {apartments.currency}
                      {t.price.toLocaleString("en-ZM")} {apartments.priceSuffix}
                    </option>
                  ))}
                  <option value="unsure">Not sure yet</option>
                </select>
                {err("unit")}
              </div>
              <div>
                <label htmlFor="enquiry-dates" className="eyebrow text-sand/70">
                  Dates <span className="normal-case tracking-normal text-sand/45">(optional)</span>
                </label>
                <input id="enquiry-dates" name="dates" placeholder="e.g. 12–15 Nov" className="field" value={fields.dates} onChange={set("dates")} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enquiry-message" className="eyebrow text-sand/70">
                  Message <span className="normal-case tracking-normal text-sand/45">(optional)</span>
                </label>
                <textarea id="enquiry-message" name="message" rows={3} className="field resize-none" value={fields.message} onChange={set("message")} {...aria("message")} />
                {err("message")}
              </div>
              <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                <MagneticButton type="submit" className="btn-copper">
                  <Icon name="whatsapp" className="h-4 w-4" /> Send enquiry
                </MagneticButton>
                <p id={`${uid}-note`} className="text-sm text-paper/55">
                  Prefer to talk? Call{" "}
                  <a href={site.phone.tel} className="link-u text-paper">
                    {site.phone.display}
                  </a>
                </p>
              </div>
              <p role="status" className="text-sm text-sand sm:col-span-2">
                {sent ? "Thank you! WhatsApp has opened with your enquiry. Press send and we’ll reply shortly." : ""}
              </p>
            </form>
          </div>

          {/* Details + map */}
          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
            <div>
              <p className="eyebrow text-copper-light">Call or WhatsApp</p>
              <a href={site.phone.tel} className="display link-u mt-3 inline-block text-[clamp(3rem,6.5vw,6rem)] leading-[0.9]">
                {site.phone.display}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <p className="eyebrow text-copper-light">Address</p>
              <address className="mt-2 text-xl not-italic">{site.address.full}</address>
              <p className="text-sm text-paper/55">
                {site.branch.label}. {site.branch.text}
              </p>
            </div>
            <MapEmbed className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]" />
            <div className="flex flex-wrap gap-3">
              <MagneticButton href={site.map.shortLink} className="btn-light">
                Open in Google Maps <Icon name="arrow" className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
